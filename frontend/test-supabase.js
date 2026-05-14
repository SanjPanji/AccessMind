import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase Connection...');
  try {
    // We try to fetch from a non-existent table just to see if the API responds
    // Or we can try to get the auth config or similar. 
    // The easiest is just to try fetching from a known table or any table.
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      // If the error is about the relation "users" not existing, it means the connection 
      // succeeded but the table doesn't exist yet, which is fine! It means we hit the DB.
      if (error.code === '42P01') {
        console.log('✅ Successfully connected to Supabase!');
        console.log('⚠️ The "users" table does not exist yet, which is expected since we just created the scheme.sql.');
      } else {
        console.error('❌ Connection failed or another error occurred:', error.message);
      }
    } else {
      console.log('✅ Successfully connected to Supabase and queried the "users" table!');
    }
  } catch (err) {
    console.error('❌ Unexpected error during connection:', err);
  }
}

testConnection();
