const fs = require('fs');
const path = require('path');

// Read environment variables from Vercel (or process.env)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_KEY not set. Using empty values.');
}

// Create environment.production.ts content
const envContent = `export const environment = {
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}',
};
`;

// Write to environment.production.ts
const envPath = path.join(__dirname, '../src/environments/environment.production.ts');
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('Environment file generated successfully');

