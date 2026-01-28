require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// High-quality professional prompts
const QUALITY_PROMPTS = [
    // CODING - Professional Development Prompts
    {
        title: "Senior Code Reviewer",
        title_ar: "مراجع كود احترافي",
        content: `Act as a senior software engineer with 15+ years of experience. Review the following code for:

1. **Security vulnerabilities** - SQL injection, XSS, authentication issues
2. **Performance bottlenecks** - Time/space complexity, memory leaks
3. **Code quality** - SOLID principles, DRY, clean code practices
4. **Best practices** - Industry standards, design patterns
5. **Maintainability** - Documentation, naming conventions, modularity

For each issue found, provide:
- Severity level (Critical/High/Medium/Low)
- Line number and problematic code
- Explanation of the issue
- Recommended fix with code example

Code to review:
[PASTE YOUR CODE HERE]`,
        category: "coding",
        ai_model: "gpt-4",
        tags: ["code-review", "security", "best-practices", "senior-developer"],
        likes: 487
    },
    {
        title: "Full-Stack Architecture Designer",
        title_ar: "مصمم معمارية التطبيقات الكاملة",
        content: `You are a solutions architect specializing in scalable web applications. Design a complete system architecture for:

**Project:** [DESCRIBE YOUR PROJECT]

Please provide:

## 1. System Overview
- High-level architecture diagram (describe in text)
- Core components and their responsibilities

## 2. Technology Stack
- Frontend framework and why
- Backend framework and database
- Caching strategy (Redis, Memcached)
- Message queue if needed

## 3. Database Design
- Schema design with relationships
- Indexing strategy
- Data partitioning approach

## 4. API Design
- RESTful or GraphQL recommendation
- Authentication method (JWT, OAuth2)
- Rate limiting strategy

## 5. Scalability Plan
- Horizontal vs vertical scaling
- Load balancing approach
- CDN integration

## 6. Security Measures
- OWASP Top 10 mitigations
- Data encryption (at rest and in transit)

## 7. DevOps & Deployment
- CI/CD pipeline
- Container orchestration
- Monitoring and logging`,
        category: "coding",
        ai_model: "gpt-4",
        tags: ["architecture", "full-stack", "scalability", "system-design"],
        likes: 523
    },
    {
        title: "React Component Generator",
        title_ar: "مولد مكونات React احترافي",
        content: `Create a production-ready React component with the following specifications:

**Component Name:** [NAME]
**Purpose:** [DESCRIBE WHAT IT SHOULD DO]

Requirements:
- TypeScript with proper interfaces
- Tailwind CSS for styling
- Framer Motion for animations
- Proper accessibility (ARIA labels)
- Responsive design (mobile-first)
- Error boundaries
- Loading states
- Unit test with Jest/React Testing Library

Include:
1. Main component file
2. Types/interfaces file
3. Custom hooks if needed
4. Test file
5. Storybook story
6. Usage example in README format`,
        category: "coding",
        ai_model: "gpt-4",
        tags: ["react", "typescript", "component", "frontend"],
        likes: 412
    },
    {
        title: "Python Data Pipeline Builder",
        title_ar: "بناء خطوط بيانات Python",
        content: `Design and implement a robust data pipeline in Python for:

**Data Source:** [DESCRIBE YOUR DATA SOURCE]
**Destination:** [WHERE DATA SHOULD GO]
**Frequency:** [REAL-TIME / BATCH / SCHEDULED]

Deliverables:

1. **ETL Pipeline Code**
   - Extract: API calls, file reading, database queries
   - Transform: Data cleaning, normalization, aggregation
   - Load: Database insertion, file writing

2. **Error Handling**
   - Retry mechanisms with exponential backoff
   - Dead letter queue for failed records
   - Alerting system integration

3. **Monitoring**
   - Pipeline metrics (throughput, latency)
   - Data quality checks
   - Logging best practices

4. **Scalability**
   - Parallel processing with multiprocessing/threading
   - Chunked processing for large datasets
   - Memory optimization techniques

5. **Testing**
   - Unit tests for each transformation
   - Integration tests
   - Data validation tests

Use libraries: pandas, sqlalchemy, requests, logging, pytest`,
        category: "coding",
        ai_model: "gpt-4",
        tags: ["python", "data-pipeline", "etl", "automation"],
        likes: 389
    },

    // WRITING - Professional Content Prompts
    {
        title: "Viral LinkedIn Post Creator",
        title_ar: "كاتب منشورات LinkedIn الفيروسية",
        content: `You are a LinkedIn content strategist who has helped creators reach millions of impressions. Create a viral LinkedIn post about:

**Topic:** [YOUR TOPIC]
**Goal:** [AWARENESS / ENGAGEMENT / LEADS]
**Target Audience:** [WHO ARE YOU WRITING FOR]

Post Structure:
1. **Hook (First Line)** - Pattern interrupt, curiosity gap, or bold statement
2. **Story/Problem** - Relatable situation or pain point
3. **Insight/Solution** - Your unique perspective or lesson
4. **Proof/Example** - Data, case study, or personal experience
5. **Call to Action** - Engagement prompt (question, poll, share request)

Guidelines:
- Use line breaks for readability
- Include 3-5 relevant emojis strategically
- Add 3-5 targeted hashtags at the end
- Keep under 3000 characters
- Write in first person
- Be authentic and vulnerable
- Include a "scroll-stopper" opening`,
        category: "writing",
        ai_model: "gpt-4",
        tags: ["linkedin", "viral-content", "social-media", "personal-branding"],
        likes: 567
    },
    {
        title: "SEO Blog Article Writer",
        title_ar: "كاتب مقالات SEO احترافي",
        content: `Write a comprehensive, SEO-optimized blog article that will rank on Google:

**Primary Keyword:** [MAIN KEYWORD]
**Secondary Keywords:** [2-3 RELATED KEYWORDS]
**Word Count:** 2000-2500 words
**Target Audience:** [WHO IS READING THIS]

Article Structure:

## Meta Information
- SEO Title (60 characters max)
- Meta Description (155 characters max)
- URL Slug

## Content Outline
1. **Introduction** (150 words)
   - Hook the reader
   - State the problem
   - Preview the solution

2. **Main Sections** (4-6 H2 headers)
   - Include H3 subheadings
   - Use bullet points and numbered lists
   - Add relevant statistics with sources

3. **Conclusion**
   - Summarize key points
   - Include clear CTA

## SEO Requirements
- Keyword density: 1-2%
- Internal linking suggestions (3-5 links)
- External linking to authoritative sources
- Image alt text suggestions
- Schema markup recommendations

Write in a conversational, authoritative tone.`,
        category: "writing",
        ai_model: "gpt-4",
        tags: ["seo", "blog", "content-marketing", "google-ranking"],
        likes: 498
    },
    {
        title: "Email Sequence Copywriter",
        title_ar: "كاتب سلسلة إيميلات تسويقية",
        content: `Create a 7-email nurture sequence that converts subscribers into customers:

**Product/Service:** [WHAT ARE YOU SELLING]
**Price Point:** [$ AMOUNT]
**Target Avatar:** [IDEAL CUSTOMER DESCRIPTION]
**Main Pain Point:** [WHAT PROBLEM DO YOU SOLVE]

Email Sequence:

**Email 1: Welcome & Quick Win**
- Subject line options (3)
- Deliver immediate value
- Set expectations

**Email 2: Story & Connection**
- Your origin story
- Build relatability

**Email 3: Education**
- Teach something valuable
- Position as expert

**Email 4: Case Study**
- Customer success story
- Social proof

**Email 5: Address Objections**
- FAQ format
- Handle common concerns

**Email 6: Soft Pitch**
- Introduce your solution
- Benefits over features

**Email 7: Hard Close**
- Urgency/scarcity
- Clear CTA
- PS line

For each email include:
- 3 subject line options
- Preview text
- Full email body
- CTA button text`,
        category: "writing",
        ai_model: "gpt-4",
        tags: ["email-marketing", "copywriting", "sales-funnel", "conversion"],
        likes: 445
    },

    // ART & DESIGN - Creative Prompts
    {
        title: "Cinematic Scene Creator",
        title_ar: "مصمم مشاهد سينمائية",
        content: `Create a photorealistic cinematic scene with the following specifications:

**Subject:** [MAIN SUBJECT OF THE IMAGE]
**Setting:** [LOCATION/ENVIRONMENT]
**Mood:** [EMOTION YOU WANT TO CONVEY]

Technical Parameters:
- Aspect ratio: 16:9 (cinematic widescreen)
- Lighting: Golden hour, volumetric god rays
- Camera: Shot on ARRI Alexa, 35mm lens
- Depth of field: Shallow, f/1.8
- Color grading: Teal and orange, filmic look

Style Keywords:
- Hyperrealistic, 8K resolution
- Award-winning cinematography
- Film grain, lens flare
- Atmospheric haze
- Professional color grading

Composition:
- Rule of thirds placement
- Leading lines
- Dynamic perspective
- Foreground, midground, background layers

Reference styles: Roger Deakins, Emmanuel Lubezki, Denis Villeneuve films`,
        category: "art",
        ai_model: "midjourney",
        tags: ["cinematic", "photorealistic", "film", "photography"],
        likes: 612
    },
    {
        title: "Brand Identity Designer",
        title_ar: "مصمم هوية العلامة التجارية",
        content: `Design a complete brand identity system for:

**Brand Name:** [YOUR BRAND NAME]
**Industry:** [BUSINESS TYPE]
**Target Audience:** [WHO ARE YOUR CUSTOMERS]
**Brand Personality:** [3-5 ADJECTIVES - e.g., Modern, Trustworthy, Innovative]
**Competitors:** [2-3 COMPETITOR BRANDS]

Deliverables:

## 1. Logo Design
- Primary logo (horizontal)
- Secondary logo (stacked)
- Icon/favicon
- Monochrome versions
- Minimum size guidelines

## 2. Color Palette
- Primary color (with hex, RGB, CMYK)
- Secondary colors (2-3)
- Accent color
- Neutral colors
- Color usage ratios

## 3. Typography
- Primary typeface (for headlines)
- Secondary typeface (for body)
- Web-safe alternatives
- Font pairing rationale

## 4. Visual Elements
- Pattern/texture
- Iconography style
- Photography direction
- Illustration style (if applicable)

## 5. Brand Applications
- Business card design
- Letterhead
- Email signature
- Social media templates

Style: Clean, modern, premium aesthetic`,
        category: "art",
        ai_model: "midjourney",
        tags: ["branding", "logo-design", "identity", "visual-design"],
        likes: 534
    },
    {
        title: "UI Dashboard Designer",
        title_ar: "مصمم لوحات تحكم UI",
        content: `Design a modern analytics dashboard UI with the following specifications:

**Dashboard Type:** [ANALYTICS / ADMIN / SAAS / FINANCE]
**Primary Users:** [WHO WILL USE THIS DAILY]
**Key Metrics:** [WHAT DATA SHOULD BE DISPLAYED]

Design Requirements:

## Layout
- Dark mode with accent colors
- Responsive grid system
- Collapsible sidebar navigation
- Header with search and notifications

## Components
- KPI cards with sparkline charts
- Line/bar/pie chart widgets
- Data tables with sorting/filtering
- Date range selector
- User avatar with dropdown

## Visual Style
- Glassmorphism effects
- Subtle gradients
- Micro-interactions
- Consistent 8px spacing grid
- Border radius: 12px for cards

## Color Scheme
- Background: Deep navy (#0F172A)
- Cards: Slightly lighter (#1E293B)
- Primary accent: Cyan (#00D9FF)
- Success: Green (#22C55E)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)

## Typography
- Inter or SF Pro for numbers
- Clean, readable hierarchy
- Proper visual contrast

Reference: Linear, Vercel, Stripe dashboards`,
        category: "art",
        ai_model: "midjourney",
        tags: ["ui-design", "dashboard", "dark-mode", "saas"],
        likes: 478
    },

    // MARKETING - Strategy Prompts
    {
        title: "Go-To-Market Strategy Creator",
        title_ar: "استراتيجية إطلاق المنتج",
        content: `Develop a comprehensive Go-To-Market (GTM) strategy for:

**Product:** [YOUR PRODUCT/SERVICE]
**Target Market:** [PRIMARY MARKET]
**Launch Date:** [WHEN]
**Budget:** [$ AMOUNT]

## 1. Market Analysis
- Total Addressable Market (TAM)
- Serviceable Addressable Market (SAM)
- Serviceable Obtainable Market (SOM)
- Competitive landscape analysis

## 2. Customer Segmentation
- Ideal Customer Profile (ICP)
- Buyer personas (2-3)
- Customer journey mapping
- Pain points and motivations

## 3. Value Proposition
- Unique value proposition statement
- Key differentiators
- Positioning statement
- Messaging framework

## 4. Pricing Strategy
- Pricing model recommendation
- Competitive pricing analysis
- Discount/promotion strategy
- Revenue projections

## 5. Channel Strategy
- Distribution channels
- Partnership opportunities
- Content marketing plan
- Paid acquisition strategy

## 6. Launch Timeline
- Pre-launch activities (60 days)
- Launch week activities
- Post-launch optimization
- Key milestones and KPIs

## 7. Success Metrics
- North star metric
- Leading indicators
- Lagging indicators
- Dashboard setup`,
        category: "marketing",
        ai_model: "gpt-4",
        tags: ["gtm", "product-launch", "strategy", "market-analysis"],
        likes: 456
    },
    {
        title: "Social Media Content Calendar",
        title_ar: "تقويم محتوى وسائل التواصل",
        content: `Create a 30-day social media content calendar for:

**Brand:** [YOUR BRAND NAME]
**Industry:** [YOUR INDUSTRY]
**Platforms:** Instagram, Twitter/X, LinkedIn, TikTok
**Goals:** [AWARENESS / ENGAGEMENT / SALES]
**Content Pillars:** [3-5 MAIN TOPICS]

For each day, provide:

## Post Details
- Platform(s)
- Content type (carousel, reel, story, thread)
- Caption/copy
- Hashtags (platform-specific)
- Best posting time
- CTA

## Content Mix (Per Week)
- Educational posts: 40%
- Entertaining posts: 30%
- Promotional posts: 20%
- User-generated content: 10%

## Special Considerations
- Trending topics integration
- Holiday/event tie-ins
- Cross-platform repurposing
- Engagement prompts
- Story/reel ideas

## Weekly Themes
- Week 1: [THEME]
- Week 2: [THEME]
- Week 3: [THEME]
- Week 4: [THEME]

Include engagement hooks and viral triggers for each post.`,
        category: "marketing",
        ai_model: "gpt-4",
        tags: ["social-media", "content-calendar", "instagram", "marketing"],
        likes: 489
    },
    {
        title: "Facebook Ads Campaign Builder",
        title_ar: "بناء حملات إعلانات فيسبوك",
        content: `Create a complete Facebook/Meta Ads campaign structure for:

**Business:** [YOUR BUSINESS]
**Objective:** [CONVERSIONS / LEADS / AWARENESS]
**Monthly Budget:** [$ AMOUNT]
**Target Location:** [COUNTRIES/CITIES]

## Campaign Structure

### Campaign 1: Top of Funnel (Awareness)
**Objective:** Reach / Video Views
- Ad Set 1: Interest-based targeting
- Ad Set 2: Lookalike 1%
- Ad Set 3: Broad targeting

### Campaign 2: Middle of Funnel (Consideration)
**Objective:** Traffic / Engagement
- Ad Set 1: Video viewers 75%
- Ad Set 2: Page engagers
- Ad Set 3: Website visitors

### Campaign 3: Bottom of Funnel (Conversion)
**Objective:** Conversions / Sales
- Ad Set 1: Add to cart (no purchase)
- Ad Set 2: Website visitors (7 days)
- Ad Set 3: Email subscribers

## For Each Ad Set Provide:
- Detailed targeting options
- Placement recommendations
- Budget allocation
- Bid strategy
- 3 ad variations (copy + creative direction)

## Ad Copy Templates:
- Primary text (3 versions)
- Headlines (5 options)
- Descriptions (3 options)
- CTA button recommendation

## Creative Specifications:
- Image ads: 1080x1080, 1200x628
- Video ads: 15s, 30s versions
- Carousel: 5 slides outline

## Optimization Strategy:
- KPIs to track
- A/B testing plan
- Scaling criteria
- Kill criteria`,
        category: "marketing",
        ai_model: "gpt-4",
        tags: ["facebook-ads", "meta-ads", "paid-advertising", "performance-marketing"],
        likes: 512
    }
];

async function seedQualityPrompts() {
    console.log('🚀 Starting quality prompts seeding...');
    console.log(`📊 Total prompts to insert: ${QUALITY_PROMPTS.length}`);

    let insertedCount = 0;

    for (const prompt of QUALITY_PROMPTS) {
        const { error } = await supabase.from('prompts').insert({
            title: prompt.title,
            title_ar: prompt.title_ar,
            content: prompt.content,
            category: prompt.category,
            ai_model: prompt.ai_model,
            tags: prompt.tags,
            likes: prompt.likes,
            image_url: null,
            created_at: new Date().toISOString(),
        });

        if (error) {
            console.error(`❌ Error inserting "${prompt.title}":`, error.message);
        } else {
            insertedCount++;
            console.log(`✅ Inserted: ${prompt.title}`);
        }
    }

    console.log('🎉 Seeding complete!');
    console.log(`📈 Total inserted: ${insertedCount}/${QUALITY_PROMPTS.length} prompts`);
}

seedQualityPrompts();
