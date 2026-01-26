-- 1. Add image_url column to prompts table
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Create storage bucket for prompt images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt-images', 'prompt-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Security Policies for Storage
-- Allow public access to view images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'prompt-images' );

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'prompt-images' AND auth.role() = 'authenticated' );

-- Allow users to update their own images (optional but good practice)
DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
CREATE POLICY "Owner Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'prompt-images' AND auth.uid() = owner );

-- Allow users to delete their own images
DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;
CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'prompt-images' AND auth.uid() = owner );
