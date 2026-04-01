import pool from '../config/db.js';

export const findByProjectId = async (projectId) => {
  const [rows] = await pool.query(
    'SELECT * FROM alternatives WHERE project_id = ?',
    [projectId],
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM alternatives WHERE id = ?', [
    id,
  ]);
  return rows[0];
};

export const create = async (projectId, name, description) => {
  const [result] = await pool.query(
    'INSERT INTO alternatives (project_id, name, description) VALUES (?, ?, ?)',
    [projectId, name, description || null],
  );
  return result.insertId;
};

export const update = async (id, name, description) => {
  const [result] = await pool.query(
    'UPDATE alternatives SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?',
    [name, description, id],
  );
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM alternatives WHERE id = ?', [
    id,
  ]);
  return result.affectedRows > 0;
};
