import * as criterionService from '../services/criterion.service.js';

export const getCriteria = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId)
      return res
        .status(400)
        .json({ message: 'projectId query parameter is required' });

    const criteria = await criterionService.getCriteriaByProject(projectId);
    res.status(200).json(criteria);
  } catch (error) {
    next(error);
  }
};

export const getCriterionById = async (req, res, next) => {
  try {
    const criterion = await criterionService.getCriterionById(req.params.id);
    res.status(200).json(criterion);
  } catch (error) {
    if (error.message === 'CRITERION_NOT_FOUND')
      return res.status(404).json({ message: 'Criterion not found' });
    next(error);
  }
};

export const createCriterion = async (req, res, next) => {
  try {
    const criterion = await criterionService.createCriterion(req.body);
    res.status(201).json(criterion);
  } catch (error) {
    next(error);
  }
};

export const updateCriterion = async (req, res, next) => {
  try {
    await criterionService.updateCriterion(req.params.id, req.body);
    res.status(200).json({ message: 'Criterion updated successfully' });
  } catch (error) {
    if (error.message === 'CRITERION_NOT_FOUND')
      return res.status(404).json({ message: 'Criterion not found' });
    next(error);
  }
};

export const deleteCriterion = async (req, res, next) => {
  try {
    await criterionService.deleteCriterion(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'CRITERION_NOT_FOUND')
      return res.status(404).json({ message: 'Criterion not found' });
    next(error);
  }
};
