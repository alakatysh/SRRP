import mysql from 'mysql2/promise';
import { config } from './env.js';

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  const connection = await pool.getConnection();
  console.log('Successfully connected to the database');
  connection.release();
} catch (error) {
  console.error('Error connecting to the database:', error.message);
  process.exit(1);
}

export default pool;
