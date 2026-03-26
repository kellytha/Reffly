const { neon } = require('@neondatabase/serverless');
const { readFileSync } = require('fs');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function runSchema() {
  try {
    const schema = readFileSync('schema.sql', 'utf8');
    await sql.unsafe(schema);
    console.log('Schema created successfully');
  } catch (error) {
    console.error('Error creating schema:', error);
  }
}

runSchema();