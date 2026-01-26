INSERT INTO public.prompts (title, title_ar, content, category, ai_model, tags, likes) VALUES
  (
    'React & Tailwind Component Generator', 
    'مولد مكونات React و Tailwind', 
    'Create a modern, responsive React component using Tailwind CSS. The component should be a [COMPONENT_NAME] with features like [FEATURES]. Ensure it handles dark mode, has proper accessibility attributes (ARIA), and uses Lucide-react for icons. Provide only the code with brief comments.', 
    'coding', 
    'claude', 
    ARRAY['React', 'Tailwind', 'Frontend', 'UI'], 
    120
  ),
  (
    'Cinematic Portrait Photography', 
    'تصوير بورتريه سينمائي', 
    'Cinematic shot, hyper-realistic portrait of an elderly fisherman with weathered skin, wearing a yellow raincoat, stormy sea background, dramatic lighting, shot on 35mm lens, f/1.8, 8k resolution, highly detailed texture --ar 4:5 --v 6.0 --style raw', 
    'art', 
    'midjourney', 
    ARRAY['Photography', 'Portrait', 'Cinematic', 'Realism'], 
    340
  ),
  (
    'Viral LinkedIn Post Creator', 
    'صانع منشورات لينكد إن فيرال', 
    'Write a LinkedIn post about [TOPIC]. Use a strong hook in the first line to grab attention. Structure the post with short, punchy sentences. Include a "Lesson Learned" section and end with an engaging question to drive comments. Keep the tone professional yet personal.', 
    'marketing', 
    'gpt-4', 
    ARRAY['LinkedIn', 'Social Media', 'Personal Branding'], 
    215
  ),
  (
    'Python Data Analysis Script', 
    'سكربت تحليل بيانات بايثون', 
    'Write a Python script using Pandas and Matplotlib to analyze a CSV file containing sales data. The script should: 1. Clean missing values. 2. Group sales by month and category. 3. Generate a bar chart showing top-selling products. 4. Print a summary of key insights.', 
    'coding', 
    'gpt-4', 
    ARRAY['Python', 'Data Science', 'Pandas', 'Visualization'], 
    180
  ),
  (
    'SEO-Optimized Product Description', 
    'وصف منتج متوافق مع SEO', 
    'Write a persuasive and SEO-friendly product description for [PRODUCT_NAME]. Highlight its key benefits (not just features), address common pain points, and include these keywords: [KEYWORDS]. The tone should be exciting and trustworthy.', 
    'marketing', 
    'gpt-3.5', 
    ARRAY['E-commerce', 'SEO', 'Copywriting'], 
    155
  ),
  (
    'Isometric 3D Icon Design', 
    'تصميم أيقونات ثلاثية الأبعاد', 
    'Cute isometric 3D icon of a futuristic rocket ship, soft clay render style, pastel colors (blue and pink), minimal background, high quality, 4k, blender 3d style --v 6.0', 
    'art', 
    'midjourney', 
    ARRAY['3D', 'Icon', 'Design', 'Minimalist'], 
    290
  ),
  (
    'YouTube Video Script Writer', 
    'كاتب سيناريو فيديو يوتيوب', 
    'Create a script for a 10-minute YouTube video about "The Future of AI". Structure it with: 1. An engaging Hook (0:00-0:45). 2. Intro animation placeholder. 3. three main segments with examples. 4. A conclusion with a Call to Action (Subscribe). Keep the language conversational and energetic.', 
    'writing', 
    'gemini', 
    ARRAY['YouTube', 'Script', 'Video Production'], 
    205
  ),
  (
    'SQL Query Optimizer', 
    'محسن استعلامات SQL', 
    'Analyze this SQL query for performance issues. Explain why it might be slow on large datasets (indexing, joins, etc.) and provide an optimized version of the query. [INSERT_QUERY_HERE]', 
    'coding', 
    'gpt-4', 
    ARRAY['SQL', 'Database', 'Performance', 'Backend'], 
    130
  ),
  (
    'Cyberpunk Cityscape Wallpaper', 
    'خلفية مدينة سايبربانك', 
    'Futuristic cyberpunk city at night, neon lights, flying cars, rain reflecting on wet pavement, towering skyscrapers with holographic ads, purple and cyan color palette, highly detailed, wide angle --ar 16:9 --v 6.0', 
    'art', 
    'midjourney', 
    ARRAY['Cyberpunk', 'Sci-Fi', 'Wallpaper', 'Environment'], 
    410
  ),
  (
    'Professional Email Responder', 
    'مردود إيميلات احترافي', 
    'Draft a polite but firm email declining a project request due to full capacity. Express gratitude for the opportunity, explain the current workload briefly, and offer to reconnect in [TIME_FRAME]. Keep the tone professional and empathetic.', 
    'writing', 
    'claude', 
    ARRAY['Email', 'Business', 'Communication'], 
    145
  );
