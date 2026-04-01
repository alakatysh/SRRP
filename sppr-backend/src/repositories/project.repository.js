import pool from '../config/db.js';

export const findAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM projects ORDER BY created_at DESC',
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
  return rows[0];
};

export const create = async (name, description) => {
  const [result] = await pool.query(
    'INSERT INTO projects (name, description) VALUES (?, ?)',
    [name, description || null],
  );
  return result.insertId;
};

export const update = async (id, name, description) => {
  const [result] = await pool.query(
    'UPDATE projects SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?',
    [name, description, id],
  );
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
