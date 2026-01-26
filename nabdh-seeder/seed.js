require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

// ≈⁄œ«œ Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const hasPlaceholder = (value) => !value || value.includes('your-project-id') || value.includes('your-service-role-key-here');
if (hasPlaceholder(SUPABASE_URL) || hasPlaceholder(SUPABASE_SERVICE_KEY)) {
  console.error('Missing or placeholder Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// »Ì«‰«  À«» … ·· ‰ÊÌ⁄
const CATEGORIES = ['coding', 'art', 'writing', 'marketing', 'productivity', 'seo'];
const AI_MODELS = ['gpt-4', 'gpt-3.5', 'claude', 'midjourney', 'gemini'];

// ﬁÊ«·» ·’‰«⁄… ⁄‰«ÊÌ‰ Ê„Õ ÊÏ Ê«ﬁ⁄Ì
const TEMPLATES = [
  { type: 'coding', title: 'Create a {lang} function to {action}', content: 'Write a professional {lang} script that {action}. Ensure it handles errors gracefully and follows best practices for {topic}.' },
  { type: 'art', title: '{style} illustration of {subject}', content: 'Generate a high-quality image of {subject} in the style of {style}. Use lighting that is {lighting} and a color palette that is {colors}. --ar 16:9 --v 6.0' },
  { type: 'writing', title: 'Write a {tone} blog post about {topic}', content: 'Act as an expert copywriter. Write a {tone} article discussing {topic}. Include 3 key takeaways and a call to action. Target audience: {audience}.' },
  { type: 'marketing', title: 'Social media strategy for {product}', content: 'Create a 30-day content calendar for {product}. Focus on platforms like LinkedIn and Twitter. The goal is to increase {goal} by 20%.' },
];

const VARIABLES = {
  lang: ['Python', 'React', 'TypeScript', 'Rust', 'Go', 'SQL'],
  action: ['parse JSON', 'authenticate users', 'scrape data', 'optimize images', 'connect to API'],
  topic: ['cybersecurity', 'AI agents', 'sustainable energy', 'remote work', 'mental health'],
  style: ['Cyberpunk', 'Minimalist', 'Watercolor', 'Photorealistic', 'Anime'],
  subject: ['a futuristic city', 'a cat wearing a suit', 'an astronaut in a garden', 'a vintage car'],
  lighting: ['cinematic', 'soft', 'neon', 'natural'],
  colors: ['vibrant', 'pastel', 'dark and moody', 'monochrome'],
  tone: ['sarcastic', 'professional', 'inspiring', 'educational'],
  product: ['a new SaaS app', 'organic coffee', 'online course', 'fitness tracker'],
  goal: ['brand awareness', 'sales', 'user retention', 'newsletter signups'],
  audience: ['developers', 'students', 'CEOs', 'stay-at-home parents']
};

// ≈⁄œ«œ«  «· ‘€Ì·
const getArgNumber = (name) => {
  const prefix = `--${name}=`;
  const arg = process.argv.find((item) => item.startsWith(prefix));
  if (!arg) return undefined;
  const value = Number(arg.slice(prefix.length));
  return Number.isFinite(value) ? value : undefined;
};

const parseNumber = (value, fallback) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback;
};

const TOTAL_PROMPTS = parseNumber(getArgNumber('total') ?? process.env.SEED_TOTAL, 1000);
const BATCH_SIZE = parseNumber(getArgNumber('batch') ?? process.env.SEED_BATCH, 50);

// œ«·… ·«” »œ«· «·„ €Ì—«  ›Ì «·ﬁÊ«·»
function fillTemplate(template) {
  let title = template.title;
  let content = template.content;

  Object.keys(VARIABLES).forEach(key => {
    const value = faker.helpers.arrayElement(VARIABLES[key]);
    const regex = new RegExp(`{${key}}`, 'g');
    title = title.replace(regex, value);
    content = content.replace(regex, value);
  });

  return { title, content };
}

async function seedPrompts() {
  console.log('?? Starting seed process...');  let insertedCount = 0;

  for (let i = 0; i < TOTAL_PROMPTS; i += BATCH_SIZE) {
    const batch = [];

    for (let j = 0; j < BATCH_SIZE; j++) {
      const template = faker.helpers.arrayElement(TEMPLATES);
      const filled = fillTemplate(template);
      const isArabic = Math.random() > 0.8; // 20% „‰ «·„Õ ÊÏ ⁄—»Ì («Œ Ì«—Ì)

      batch.push({
        title: filled.title,
        title_ar: isArabic ? `⁄‰Ê«‰  Ã—Ì»Ì: ${filled.title}` : null,
        content: filled.content,
        category: template.type, // «· √ﬂœ „‰  ÿ«»ﬁ «·›∆… „⁄ «·ﬁ«·»
        ai_model: faker.helpers.arrayElement(AI_MODELS),
        tags: [template.type, faker.word.noun(), 'ai'],
        likes: faker.number.int({ min: 0, max: 500 }),
        // ’Ê—… ⁄‘Ê«∆Ì… „‰ Unsplash (√Ê « —ﬂÂ« null)
        image_url: template.type === 'art' ? `https://source.unsplash.com/random/800x600?${template.type}` : null, 
        created_at: faker.date.past().toISOString(),
      });
    }

    const { error } = await supabase.from('prompts').insert(batch);

    if (error) {
      console.error('? Error inserting batch:', error.message);
    } else {
      insertedCount += batch.length;
      console.log(`? Inserted ${insertedCount}/${TOTAL_PROMPTS} prompts...`);
    }
  }

  console.log('?? Seeding complete!');
}

seedPrompts();



