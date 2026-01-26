-- 1. Create Enums
CREATE TYPE public.ai_model AS ENUM ('gpt-4', 'gpt-3.5', 'midjourney', 'claude', 'gemini');
CREATE TYPE public.prompt_category AS ENUM ('coding', 'writing', 'art', 'marketing');

-- 2. Create Prompts Table
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT,
  content TEXT NOT NULL,
  category public.prompt_category NOT NULL,
  ai_model public.ai_model NOT NULL,
  tags TEXT[],
  likes INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Prompts
-- Allow everyone to view prompts (Public Access)
CREATE POLICY "Enable read access for all users"
ON public.prompts FOR SELECT
USING (true);

-- Allow authenticated users to insert prompts
CREATE POLICY "Enable insert for authenticated users only"
ON public.prompts FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own prompts (assuming you might add user_id later, simpler for now)
-- For now, let's just allow authenticated users to update any prompt for simplicity in this MVP phase, 
-- or you can restrict it if you have a user_id column.
-- Since the current schema doesn't seem to strictly enforce user ownership via user_id in the table definition I saw,
-- I will allow authenticated users to update/delete. 
CREATE POLICY "Enable update for authenticated users"
ON public.prompts FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users"
ON public.prompts FOR DELETE
USING (auth.role() = 'authenticated');


-- 5. Setup Storage for Images
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt-images', 'prompt-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'prompt-images' );

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'prompt-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
CREATE POLICY "Owner Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'prompt-images' AND auth.uid() = owner );

DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;
CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'prompt-images' AND auth.uid() = owner );

