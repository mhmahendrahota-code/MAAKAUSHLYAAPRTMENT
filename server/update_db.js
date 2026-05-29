import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false }
});

async function run() {
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);`);
    console.log('Added gender to users');
    await pool.query(`ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS gender VARCHAR(20);`);
    console.log('Added gender to visitor_logs');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
