import pool from '../config/db.js';

export const findByProjectId = async (projectId) => {
  const [rows] = await pool.query(
    `SELECT e.alternative_id, e.criterion_id, e.value 
     FROM evaluations e
     JOIN alternatives a ON e.alternative_id = a.id
     WHERE a.project_id = ?`,
    [projectId],
  );
  return rows;
};

export const upsert = async (alternativeId, criterionId, value) => {
  const [result] = await pool.query(
    `INSERT INTO evaluations (alternative_id, criterion_id, value) 
     VALUES (?, ?, ?) 
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [alternativeId, criterionId, value],
  );
  return result.affectedRows > 0;
};

export const remove = async (alternativeId, criterionId) => {
  const [result] = await pool.query(
    'DELETE FROM evaluations WHERE alternative_id = ? AND criterion_id = ?',
    [alternativeId, criterionId],
  );
  return result.affectedRows > 0;
};
