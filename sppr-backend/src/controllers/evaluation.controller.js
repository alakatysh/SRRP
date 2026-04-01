import * as evaluationService from '../services/evaluation.service.js';

export const getEvaluations = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res
        .status(400)
        .json({ message: 'projectId query parameter is required' });
    }

    const evaluations =
      await evaluationService.getEvaluationsByProject(projectId);
    res.status(200).json(evaluations);
  } catch (error) {
    next(error);
  }
};

export const upsertEvaluation = async (req, res, next) => {
  try {
    await evaluationService.saveEvaluation(req.body);
    res.status(200).json({ message: 'Evaluation saved successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteEvaluation = async (req, res, next) => {
  try {
    const { alternativeId, criterionId } = req.params;
    await evaluationService.deleteEvaluation(alternativeId, criterionId);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'EVALUATION_NOT_FOUND') {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    next(error);
  }
};
