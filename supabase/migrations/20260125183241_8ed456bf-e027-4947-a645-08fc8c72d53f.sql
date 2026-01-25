-- Create app_role enum type
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies on prompts
DROP POLICY IF EXISTS "Anyone can create prompts" ON public.prompts;
DROP POLICY IF EXISTS "Anyone can update prompts" ON public.prompts;
DROP POLICY IF EXISTS "Anyone can delete prompts" ON public.prompts;

-- Create new secure policies for prompts (keep public read, restrict write to admins)
CREATE POLICY "Only admins can create prompts"
ON public.prompts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update prompts"
ON public.prompts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete prompts"
ON public.prompts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update user_settings policies for admin-only write access
DROP POLICY IF EXISTS "Settings can be inserted by everyone" ON public.user_settings;
DROP POLICY IF EXISTS "Settings can be updated by everyone" ON public.user_settings;

CREATE POLICY "Only admins can insert settings"
ON public.user_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update settings"
ON public.user_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete settings"
ON public.user_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));