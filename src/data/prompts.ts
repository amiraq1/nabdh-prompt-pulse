export interface Prompt {
  id: string;
  title: string;
  titleAr?: string;
  prompt: string;
  category: 'coding' | 'writing' | 'art' | 'marketing';
  model: 'gpt-4' | 'gpt-3.5' | 'midjourney' | 'claude' | 'gemini';
  tags: string[];
  likes: number;
}

export const prompts: Prompt[] = [
  {
    id: '1',
    title: 'Full-Stack Developer Assistant',
    titleAr: 'مساعد المطور الشامل',
    prompt: 'You are an expert full-stack developer with 15 years of experience. Help me build scalable, maintainable applications using modern best practices. Always explain your reasoning and suggest improvements. Focus on TypeScript, React, Node.js, and PostgreSQL.',
    category: 'coding',
    model: 'gpt-4',
    tags: ['TypeScript', 'React', 'Backend'],
    likes: 342
  },
  {
    id: '2',
    title: 'SEO Blog Writer',
    titleAr: 'كاتب مدونات محركات البحث',
    prompt: 'Act as an SEO expert and content writer. Write engaging, well-structured blog posts optimized for search engines. Include meta descriptions, use proper heading hierarchy, and naturally incorporate keywords. Target a reading level suitable for general audiences.',
    category: 'writing',
    model: 'gpt-4',
    tags: ['SEO', 'Content', 'Marketing'],
    likes: 289
  },
  {
    id: '3',
    title: 'Cyberpunk Character Design',
    titleAr: 'تصميم شخصية سايبربانك',
    prompt: 'A highly detailed cyberpunk character portrait, neon lighting, rain-soaked streets reflection, intricate mechanical augmentations, cinematic composition, 8k resolution, art by Simon Stålenhag and Syd Mead --ar 2:3 --v 6',
    category: 'art',
    model: 'midjourney',
    tags: ['Character', 'Cyberpunk', 'Portrait'],
    likes: 567
  },
  {
    id: '4',
    title: 'Product Launch Email Sequence',
    titleAr: 'سلسلة رسائل إطلاق المنتج',
    prompt: 'Create a 5-email sequence for launching a new SaaS product. Include: 1) Teaser email, 2) Problem-awareness, 3) Solution reveal, 4) Social proof & testimonials, 5) Limited-time offer. Make each email compelling with clear CTAs and emotional hooks.',
    category: 'marketing',
    model: 'gpt-4',
    tags: ['Email', 'Launch', 'SaaS'],
    likes: 198
  },
  {
    id: '5',
    title: 'Code Review Expert',
    titleAr: 'خبير مراجعة الكود',
    prompt: 'Review the following code as a senior engineer. Identify bugs, security vulnerabilities, performance issues, and code style problems. Suggest specific improvements with examples. Rate the code quality from 1-10 and explain your reasoning.',
    category: 'coding',
    model: 'claude',
    tags: ['Review', 'Security', 'Best Practices'],
    likes: 423
  },
  {
    id: '6',
    title: 'Fantasy Landscape Generator',
    titleAr: 'مولد المناظر الطبيعية الخيالية',
    prompt: 'Ethereal fantasy landscape with floating islands, ancient ruins covered in bioluminescent moss, twin moons in a purple twilight sky, volumetric fog, magical atmosphere, matte painting style, trending on ArtStation --ar 16:9 --v 6 --style raw',
    category: 'art',
    model: 'midjourney',
    tags: ['Landscape', 'Fantasy', 'Environment'],
    likes: 891
  },
  {
    id: '7',
    title: 'Social Media Content Calendar',
    titleAr: 'تقويم محتوى وسائل التواصل',
    prompt: 'Create a 30-day social media content calendar for [brand type]. Include post ideas, hashtag strategies, best posting times, engagement tactics, and content themes. Mix educational, entertaining, and promotional content in a 70-20-10 ratio.',
    category: 'marketing',
    model: 'gpt-4',
    tags: ['Social Media', 'Strategy', 'Content'],
    likes: 256
  },
  {
    id: '8',
    title: 'Creative Story Writer',
    titleAr: 'كاتب قصص إبداعية',
    prompt: 'You are a master storyteller in the style of Neil Gaiman and Ursula K. Le Guin. Write immersive, lyrical prose with rich world-building and complex characters. Focus on themes of hope, transformation, and the magic in ordinary things.',
    category: 'writing',
    model: 'claude',
    tags: ['Fiction', 'Creative', 'Storytelling'],
    likes: 445
  }
];

export const categories = [
  { id: 'all', label: 'All', labelAr: 'الكل' },
  { id: 'coding', label: 'Coding', labelAr: 'البرمجة' },
  { id: 'writing', label: 'Writing', labelAr: 'الكتابة' },
  { id: 'art', label: 'Art', labelAr: 'الفن' },
  { id: 'marketing', label: 'Marketing', labelAr: 'التسويق' }
];

export const models = [
  { id: 'all', label: 'All Models', labelAr: 'كل النماذج' },
  { id: 'gpt-4', label: 'GPT-4', labelAr: 'GPT-4' },
  { id: 'gpt-3.5', label: 'GPT-3.5', labelAr: 'GPT-3.5' },
  { id: 'midjourney', label: 'Midjourney', labelAr: 'Midjourney' },
  { id: 'claude', label: 'Claude', labelAr: 'Claude' },
  { id: 'gemini', label: 'Gemini', labelAr: 'Gemini' }
];
