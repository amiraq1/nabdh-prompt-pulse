require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const AI_MODELS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'llama', 'perplexity'];

const TEMPLATES = [
  { type: 'coding', title: 'Write a {lang} function to {action}', content: 'You are an expert {lang} developer. Write a clean, well-documented function that {action}. Include error handling.' },
  { type: 'coding', title: 'Debug this {lang} code', content: 'Analyze the following code for bugs and best practices violations. Provide detailed explanations.' },
  { type: 'writing', title: '{tone} blog post about {topic}', content: 'Write a {tone} blog post about {topic}. Use storytelling techniques. Target audience: {audience}.' },
  { type: 'writing', title: 'Email campaign for {product}', content: 'Create a 5-email nurture sequence for {product}. Each email should have a compelling subject line.' },
  { type: 'art', title: '{style} artwork of {subject}', content: 'Create a {style} digital artwork depicting {subject}. Use {lighting} lighting and a {colors} color palette.' },
  { type: 'art', title: 'Logo design for {product}', content: 'Design a modern, memorable logo for {product}. The logo should convey innovation and trust.' },
  { type: 'marketing', title: '{tone} LinkedIn post about {topic}', content: 'Write a {tone} LinkedIn post about {topic}. Include 3 key takeaways and a call to action.' },
  { type: 'marketing', title: 'Social media strategy for {product}', content: 'Create a 30-day content calendar for {product}. Focus on LinkedIn and Twitter.' },
];

const VARIABLES = {
  lang: ['Python', 'React', 'TypeScript', 'Rust', 'Go', 'SQL'],
  action: ['parse JSON', 'authenticate users', 'scrape data', 'optimize images', 'connect to API'],
  topic: ['cybersecurity', 'AI agents', 'sustainable energy', 'remote work', 'mental health'],
  style: ['Cyberpunk', 'Minimalist', 'Watercolor', 'Photorealistic', 'Anime'],
  subject: ['a futuristic city', 'a cat in a suit', 'an astronaut in a garden', 'a vintage car'],
  lighting: ['cinematic', 'soft', 'neon', 'natural'],
  colors: ['vibrant', 'pastel', 'dark and moody', 'monochrome'],
  tone: ['sarcastic', 'professional', 'inspiring', 'educational'],
  product: ['a new SaaS app', 'organic coffee', 'online course', 'fitness tracker'],
  goal: ['brand awareness', 'sales', 'user retention', 'newsletter signups'],
  audience: ['developers', 'students', 'CEOs', 'stay-at-home parents']
};

// Arabic titles stored as proper UTF-8 strings
const ARABIC_TITLES = {
  coding: ['\u0643\u0648\u062f \u0628\u0631\u0645\u062c\u064a \u0645\u062a\u0642\u062f\u0645', '\u062a\u0637\u0648\u064a\u0631 \u062a\u0637\u0628\u064a\u0642\u0627\u062a', '\u0628\u0631\u0645\u062c\u0629 \u0628\u0627\u064a\u062b\u0648\u0646'],
  writing: ['\u0643\u062a\u0627\u0628\u0629 \u0645\u062d\u062a\u0648\u0649 \u0625\u0628\u062f\u0627\u0639\u064a', '\u062a\u062d\u0631\u064a\u0631 \u0645\u0642\u0627\u0644\u0627\u062a', '\u0635\u064a\u0627\u063a\u0629 \u0646\u0635\u0648\u0635'],
  art: ['\u062a\u0635\u0645\u064a\u0645 \u062c\u0631\u0627\u0641\u064a\u0643\u064a', '\u0641\u0646 \u0631\u0642\u0645\u064a \u0625\u0628\u062f\u0627\u0639\u064a', '\u062a\u0635\u0645\u064a\u0645 \u0634\u0639\u0627\u0631\u0627\u062a'],
  marketing: ['\u062a\u0633\u0648\u064a\u0642 \u0631\u0642\u0645\u064a', '\u062d\u0645\u0644\u0627\u062a \u0625\u0639\u0644\u0627\u0646\u064a\u0629', '\u0628\u0646\u0627\u0621 \u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062a\u062c\u0627\u0631\u064a\u0629']
};

const getArgNumber = (name) => {
  const prefix = '--' + name + '=';
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

function fillTemplate(template) {
  let title = template.title;
  let content = template.content;
  Object.keys(VARIABLES).forEach(key => {
    const value = faker.helpers.arrayElement(VARIABLES[key]);
    const regex = new RegExp('{' + key + '}', 'g');
    title = title.replace(regex, value);
    content = content.replace(regex, value);
  });
  return { title, content };
}

function getArabicTitle(category) {
  const titles = ARABIC_TITLES[category];
  if (!titles) return null;
  return faker.helpers.arrayElement(titles);
}

async function seedPrompts() {
  console.log('Starting seed process...');
  let insertedCount = 0;

  for (let i = 0; i < TOTAL_PROMPTS; i += BATCH_SIZE) {
    const batch = [];
    for (let j = 0; j < BATCH_SIZE; j++) {
      const template = faker.helpers.arrayElement(TEMPLATES);
      const filled = fillTemplate(template);
      const shouldHaveArabicTitle = Math.random() > 0.7;
      batch.push({
        title: filled.title,
        title_ar: shouldHaveArabicTitle ? getArabicTitle(template.type) : null,
        content: filled.content,
        category: template.type,
        ai_model: faker.helpers.arrayElement(AI_MODELS),
        tags: [template.type, faker.word.noun(), 'ai'],
        likes: faker.number.int({ min: 0, max: 500 }),
        image_url: template.type === 'art' ? 'https://source.unsplash.com/random/800x600?' + template.type : null,
        created_at: faker.date.past().toISOString(),
      });
    }
    const { error } = await supabase.from('prompts').insert(batch);
    if (error) {
      console.error('Error inserting batch:', error.message);
    } else {
      insertedCount += batch.length;
      console.log('Inserted ' + insertedCount + '/' + TOTAL_PROMPTS + ' prompts...');
    }
  }
  console.log('Seeding complete! Total: ' + insertedCount);
}

seedPrompts();
