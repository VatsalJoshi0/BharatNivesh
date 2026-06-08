import pkg from 'pg';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'bharatnivesh',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

pool.on('error', (err) => logger.error('Unexpected error on idle client', err));

const mockQuery = async (queryText) => {
  if (queryText?.toLowerCase().includes('select * from users')) {
    return { rows: [{ id: 1, email: 'mock@test.com', password: 'hash', name: 'Mock User', risk_profile: 'Moderate', kyc_status: 'verified' }], command: 'SELECT', rowCount: 1 };
  }
  return { rows: [], command: 'SELECT', rowCount: 0 };
};

export async function initializeDatabase() {
  if (process.env.DB_MOCK === 'true') {
    logger.info('Database running in MOCK mode');
    return true;
  }
  
  try {
    const client = await pool.connect();
    logger.info('Database connected successfully');
    client.release();
    return true;
  } catch (err) {
    logger.warn('Database connection failed, using mock mode:', err.message);
    pool.query = mockQuery;
    return true;
  }
}

export default pool;

