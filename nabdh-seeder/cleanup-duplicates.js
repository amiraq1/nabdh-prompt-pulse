require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function removeDuplicates() {
    console.log('🧹 Starting duplicate cleanup...\n');

    // Get all prompts grouped by title
    const { data: allPrompts, error } = await supabase
        .from('prompts')
        .select('id, title, created_at')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching prompts:', error.message);
        return;
    }

    console.log(`📊 Total prompts in database: ${allPrompts.length}`);

    // Find duplicates (same title)
    const titleMap = new Map();
    const duplicateIds = [];

    for (const prompt of allPrompts) {
        if (titleMap.has(prompt.title)) {
            // This is a duplicate, mark for deletion
            duplicateIds.push(prompt.id);
        } else {
            // First occurrence, keep it
            titleMap.set(prompt.title, prompt.id);
        }
    }

    console.log(`🔍 Found ${duplicateIds.length} duplicates to remove`);

    if (duplicateIds.length === 0) {
        console.log('✅ No duplicates found!');
        return;
    }

    // Delete duplicates in batches
    const batchSize = 50;
    let deletedCount = 0;

    for (let i = 0; i < duplicateIds.length; i += batchSize) {
        const batch = duplicateIds.slice(i, i + batchSize);

        const { error: deleteError } = await supabase
            .from('prompts')
            .delete()
            .in('id', batch);

        if (deleteError) {
            console.error('Error deleting batch:', deleteError.message);
        } else {
            deletedCount += batch.length;
            console.log(`🗑️ Deleted ${deletedCount}/${duplicateIds.length} duplicates...`);
        }
    }

    // Final count
    const { count } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true });

    console.log('\n🎉 Cleanup complete!');
    console.log(`📈 Remaining prompts: ${count}`);
}

removeDuplicates();
