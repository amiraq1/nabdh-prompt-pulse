require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function checkTopPrompts() {
    const { data, error } = await supabase
        .from('prompts')
        .select('title, title_ar, likes, category')
        .order('likes', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log('\n🏆 Top 10 Prompts by Likes:\n');
    data.forEach((p, i) => {
        console.log(`${i + 1}. [${p.category}] ${p.title}`);
        console.log(`   العربي: ${p.title_ar || 'N/A'}`);
        console.log(`   ❤️ ${p.likes} likes\n`);
    });
}

checkTopPrompts();
