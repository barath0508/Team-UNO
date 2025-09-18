// Database connection test and fix script
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ywbnkqazberytnfixlls.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Ym5rcWF6YmVyeXRuZml4bGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNjUzNzcsImV4cCI6MjA3Mzc0MTM3N30.IbOSfaEsEFsZphsNp6v9CNMBP6YVbBS56xhIt3Da3-Y';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Connection successful');
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

async function testProfilesTable() {
  console.log('Testing profiles table structure...');
  
  try {
    // Test if we can query the profiles table structure
    const { data, error } = await supabase
      .from('profiles')
      .select('id, location, age')
      .limit(1);
    
    if (error) {
      console.error('Profiles table test failed:', error);
      
      // Check if it's a table not found error
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('❌ Profiles table does not exist or has wrong structure');
        return false;
      }
    }
    
    console.log('✅ Profiles table accessible');
    return true;
  } catch (err) {
    console.error('❌ Profiles table test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🔧 Starting database diagnostics...\n');
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Database connection failed. Check your internet connection and Supabase credentials.');
    return;
  }
  
  const profilesOk = await testProfilesTable();
  if (!profilesOk) {
    console.log('\n❌ Profiles table issue detected. You need to run the schema setup.');
    console.log('📝 Run the SQL commands from supabase-schema.sql in your Supabase dashboard.');
    return;
  }
  
  console.log('\n✅ All database tests passed!');
}

main().catch(console.error);