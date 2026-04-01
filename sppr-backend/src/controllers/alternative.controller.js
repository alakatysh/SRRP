import * as alternativeService from '../services/alternative.service.js';

export const getAlternatives = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId)
      return res
        .status(400)
        .json({ message: 'projectId query parameter is required' });

    const alternatives =
      await alternativeService.getAlternativesByProject(projectId);
    res.status(200).json(alternatives);
  } catch (error) {
    next(error);
  }
};

export const getAlternativeById = async (req, res, next) => {
  try {
    const alternative = await alternativeService.getAlternativeById(
      req.params.id,
    );
    res.status(200).json(alternative);
  } catch (error) {
    if (error.message === 'ALTERNATIVE_NOT_FOUND')
      return res.status(404).json({ message: 'Alternative not found' });
    next(error);
  }
};

export const createAlternative = async (req, res, next) => {
  try {
    const alternative = await alternativeService.createAlternative(req.body);
    res.status(201).json(alternative);
  } catch (error) {
    next(error);
  }
};

export const updateAlternative = async (req, res, next) => {
  try {
    await alternativeService.updateAlternative(req.params.id, req.body);
    res.status(200).json({ message: 'Alternative updated successfully' });
  } catch (error) {
    if (error.message === 'ALTERNATIVE_NOT_FOUND')
      return res.status(404).json({ message: 'Alternative not found' });
    next(error);
  }
};

export const deleteAlternative = async (req, res, next) => {
  try {
    await alternativeService.deleteAlternative(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'ALTERNATIVE_NOT_FOUND')
      return res.status(404).json({ message: 'Alternative not found' });
    next(error);
  }
};
