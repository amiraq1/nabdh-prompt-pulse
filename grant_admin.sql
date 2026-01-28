-- استبدل البريد الإلكتروني أدناه ببريدك الإلكتروني
-- Replace 'YOUR_EMAIL@EXAMPLE.COM' with your actual email

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'YOUR_EMAIL@EXAMPLE.COM'
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin'::app_role;

-- تحقق من النتيجة
SELECT * FROM public.user_roles 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@EXAMPLE.COM');
