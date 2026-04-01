import * as evaluationRepo from '../repositories/evaluation.repository.js';

export const getEvaluationsByProject = async (projectId) => {
  return await evaluationRepo.findByProjectId(projectId);
};

export const saveEvaluation = async (data) => {
  const { alternative_id, criterion_id, value } = data;
  await evaluationRepo.upsert(alternative_id, criterion_id, value);
  return true;
};

export const deleteEvaluation = async (alternativeId, criterionId) => {
  const deleted = await evaluationRepo.remove(alternativeId, criterionId);
  if (!deleted) throw new Error('EVALUATION_NOT_FOUND');
  return true;
};
