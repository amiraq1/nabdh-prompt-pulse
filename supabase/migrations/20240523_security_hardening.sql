
-- 1. Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 2. Enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Access (Everyone can see prompts)
CREATE POLICY "Public Prompts are viewable by everyone" 
ON public.prompts FOR SELECT 
USING (true);

-- 4. Admin Full Access Policy
-- Critical: Use a secure definer function or direct join for performance AND security
CREATE POLICY "Admins can perform all actions on prompts"
ON public.prompts
FOR ALL
USING (
  exists (
    select 1 from public.user_roles 
    where user_id = auth.uid() 
    and role = 'admin'
  )
);

-- 5. User Roles Protection
-- Users can read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Only Service Role (Database Admin) can assign roles initially
-- (Or you can create a policy for Super Admins)
