const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from parent directory
const envPath = path.join(__dirname, '../.env');
const localEnvPath = path.join(__dirname, '../.env.local');

dotenv.config({ path: envPath });
dotenv.config({ path: localEnvPath, override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const email = process.argv[2];

if (!email) {
    console.log('\nUsage: node make-admin.js <email>');
    console.log('Example: node make-admin.js user@example.com\n');
    process.exit(1);
}

async function grantAdmin() {
    console.log(`\n🔍 Searching for user: ${email}...`);

    // Note: listUsers isn't ideal for production with millions of users, but fine here.
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('❌ Error fetching users:', userError.message);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error(`❌ User not found! Please ensure the user has signed up/logged in at least once.`);
        return;
    }

    console.log(`✅ Found User ID: ${user.id}`);

    // Check existing role
    const { data: existingRole, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is 'not found'
        console.error('⚠️ Error checking roles:', roleError.message);
    }

    if (existingRole) {
        if (existingRole.role === 'admin') {
            console.log('ℹ️  This user is ALREADY an Admin.');
            return;
        }

        // Update
        console.log('🔄 Updating request...');
        const { error: updateError } = await supabase
            .from('user_roles')
            .update({ role: 'admin' })
            .eq('user_id', user.id);

        if (updateError) console.error('❌ Update failed:', updateError.message);
        else console.log('🎉 Success! User role updated to ADMIN.');

    } else {
        // Insert
        console.log('➕ Assigning Admin role...');
        const { error: insertError } = await supabase
            .from('user_roles')
            .insert({ user_id: user.id, role: 'admin' });

        if (insertError) console.error('❌ Insert failed:', insertError.message);
        else console.log('🎉 Success! User is now an ADMIN.');
    }
}

grantAdmin();
