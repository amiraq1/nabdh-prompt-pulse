-- 1. Create the Enum type for roles (if not exists)
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT user_roles_user_id_key UNIQUE (user_id)
);

-- 3. Enable RLS (Security)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Allow users to read their own role
CREATE POLICY "Users can read their own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Allow admins to manage all roles (Bootstrapping problem: we add the first admin manually via SQL or script)
CREATE POLICY "Admins can do everything on user_roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Create the has_role Check Function
CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant access to the function
GRANT EXECUTE ON FUNCTION public.has_role(app_role, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(app_role, uuid) TO service_role;
