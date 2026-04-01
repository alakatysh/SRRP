import * as alternativeRepo from '../repositories/alternative.repository.js';

export const getAlternativesByProject = async (projectId) => {
  return await alternativeRepo.findByProjectId(projectId);
};

export const getAlternativeById = async (id) => {
  const alternative = await alternativeRepo.findById(id);
  if (!alternative) throw new Error('ALTERNATIVE_NOT_FOUND');
  return alternative;
};

export const createAlternative = async (data) => {
  const { project_id, name, description } = data;
  const id = await alternativeRepo.create(project_id, name, description);
  return { id, project_id, name, description };
};

export const updateAlternative = async (id, data) => {
  const { name, description } = data;
  const updated = await alternativeRepo.update(id, name, description);
  if (!updated) throw new Error('ALTERNATIVE_NOT_FOUND');
  return true;
};

export const deleteAlternative = async (id) => {
  const deleted = await alternativeRepo.remove(id);
  if (!deleted) throw new Error('ALTERNATIVE_NOT_FOUND');
  return true;
};
