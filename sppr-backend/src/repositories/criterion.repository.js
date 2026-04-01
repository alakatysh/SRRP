import pool from '../config/db.js';

export const findByProjectId = async (projectId) => {
  const [rows] = await pool.query(
    'SELECT * FROM criteria WHERE project_id = ?',
    [projectId],
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM criteria WHERE id = ?', [id]);
  return rows[0];
};

export const create = async (projectId, name, type, weight, description) => {
  const [result] = await pool.query(
    'INSERT INTO criteria (project_id, name, type, weight, description) VALUES (?, ?, ?, ?, ?)',
    [projectId, name, type, weight || 1.0, description || null],
  );
  return result.insertId;
};

export const update = async (id, name, type, weight, description) => {
  const [result] = await pool.query(
    'UPDATE criteria SET name = COALESCE(?, name), type = COALESCE(?, type), weight = COALESCE(?, weight), description = COALESCE(?, description) WHERE id = ?',
    [name, type, weight, description, id],
  );
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM criteria WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
