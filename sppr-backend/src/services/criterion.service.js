import * as criterionRepo from '../repositories/criterion.repository.js';

export const getCriteriaByProject = async (projectId) => {
  return await criterionRepo.findByProjectId(projectId);
};

export const getCriterionById = async (id) => {
  const criterion = await criterionRepo.findById(id);
  if (!criterion) throw new Error('CRITERION_NOT_FOUND');
  return criterion;
};

export const createCriterion = async (data) => {
  const { project_id, name, type, weight, description } = data;
  const id = await criterionRepo.create(
    project_id,
    name,
    type,
    weight,
    description,
  );
  return { id, project_id, name, type, weight: weight || 1.0, description };
};

export const updateCriterion = async (id, data) => {
  const { name, type, weight, description } = data;
  const updated = await criterionRepo.update(
    id,
    name,
    type,
    weight,
    description,
  );
  if (!updated) throw new Error('CRITERION_NOT_FOUND');
  return true;
};

export const deleteCriterion = async (id) => {
  const deleted = await criterionRepo.remove(id);
  if (!deleted) throw new Error('CRITERION_NOT_FOUND');
  return true;
};
