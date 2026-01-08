
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const FASHION_CATEGORIES = [
    'formal-edit', 'wedding-edit', 'luxury-unstitched',
    'easy-glam', 'mnm-everywear', 'jewelry', 'bags'
];

async function cleanup() {
    console.log('Starting inventory cleanup...');

    // Delete products that are NOT in the 7 fashion categories
    const { data, error } = await supabase
        .from('products')
        .delete()
        .not('category', 'in', `(${FASHION_CATEGORIES.join(',')})`);

    if (error) {
        console.error('Error during cleanup:', error.message);
    } else {
        console.log('Cleanup successful. Stale inventory removed.');
    }
}

cleanup();
