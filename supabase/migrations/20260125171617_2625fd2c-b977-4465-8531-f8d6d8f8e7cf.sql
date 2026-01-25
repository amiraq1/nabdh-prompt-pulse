-- Create enum for categories
CREATE TYPE public.prompt_category AS ENUM ('coding', 'writing', 'art', 'marketing');

-- Create enum for AI models
CREATE TYPE public.ai_model AS ENUM ('gpt-4', 'gpt-3.5', 'midjourney', 'claude', 'gemini');

-- Create prompts table
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  title_ar TEXT,
  content TEXT NOT NULL,
  category prompt_category NOT NULL,
  ai_model ai_model NOT NULL,
  tags TEXT[] DEFAULT '{}',
  likes INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (prompts are public content)
CREATE POLICY "Prompts are publicly readable"
  ON public.prompts
  FOR SELECT
  USING (true);

-- Create policy for public insert (for now, anyone can submit prompts)
CREATE POLICY "Anyone can create prompts"
  ON public.prompts
  FOR INSERT
  WITH CHECK (true);

-- Create policy for public update (for likes functionality)
CREATE POLICY "Anyone can update prompts"
  ON public.prompts
  FOR UPDATE
  USING (true);

-- Create policy for public delete (admin will be added later)
CREATE POLICY "Anyone can delete prompts"
  ON public.prompts
  FOR DELETE
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data
INSERT INTO public.prompts (title, title_ar, content, category, ai_model, tags, likes) VALUES
  ('Full-Stack Developer Assistant', 'مساعد المطور الشامل', 'You are an expert full-stack developer with 15 years of experience. Help me build scalable, maintainable applications using modern best practices. Always explain your reasoning and suggest improvements. Focus on TypeScript, React, Node.js, and PostgreSQL.', 'coding', 'gpt-4', ARRAY['TypeScript', 'React', 'Backend'], 342),
  ('SEO Blog Writer', 'كاتب مدونات محركات البحث', 'Act as an SEO expert and content writer. Write engaging, well-structured blog posts optimized for search engines. Include meta descriptions, use proper heading hierarchy, and naturally incorporate keywords. Target a reading level suitable for general audiences.', 'writing', 'gpt-4', ARRAY['SEO', 'Content', 'Marketing'], 289),
  ('Cyberpunk Character Design', 'تصميم شخصية سايبربانك', 'A highly detailed cyberpunk character portrait, neon lighting, rain-soaked streets reflection, intricate mechanical augmentations, cinematic composition, 8k resolution, art by Simon Stålenhag and Syd Mead --ar 2:3 --v 6', 'art', 'midjourney', ARRAY['Character', 'Cyberpunk', 'Portrait'], 567),
  ('Product Launch Email Sequence', 'سلسلة رسائل إطلاق المنتج', 'Create a 5-email sequence for launching a new SaaS product. Include: 1) Teaser email, 2) Problem-awareness, 3) Solution reveal, 4) Social proof & testimonials, 5) Limited-time offer. Make each email compelling with clear CTAs and emotional hooks.', 'marketing', 'gpt-4', ARRAY['Email', 'Launch', 'SaaS'], 198),
  ('Code Review Expert', 'خبير مراجعة الكود', 'Review the following code as a senior engineer. Identify bugs, security vulnerabilities, performance issues, and code style problems. Suggest specific improvements with examples. Rate the code quality from 1-10 and explain your reasoning.', 'coding', 'claude', ARRAY['Review', 'Security', 'Best Practices'], 423),
  ('Fantasy Landscape Generator', 'مولد المناظر الطبيعية الخيالية', 'Ethereal fantasy landscape with floating islands, ancient ruins covered in bioluminescent moss, twin moons in a purple twilight sky, volumetric fog, magical atmosphere, matte painting style, trending on ArtStation --ar 16:9 --v 6 --style raw', 'art', 'midjourney', ARRAY['Landscape', 'Fantasy', 'Environment'], 891),
  ('Social Media Content Calendar', 'تقويم محتوى وسائل التواصل', 'Create a 30-day social media content calendar for [brand type]. Include post ideas, hashtag strategies, best posting times, engagement tactics, and content themes. Mix educational, entertaining, and promotional content in a 70-20-10 ratio.', 'marketing', 'gpt-4', ARRAY['Social Media', 'Strategy', 'Content'], 256),
  ('Creative Story Writer', 'كاتب قصص إبداعية', 'You are a master storyteller in the style of Neil Gaiman and Ursula K. Le Guin. Write immersive, lyrical prose with rich world-building and complex characters. Focus on themes of hope, transformation, and the magic in ordinary things.', 'writing', 'claude', ARRAY['Fiction', 'Creative', 'Storytelling'], 445);