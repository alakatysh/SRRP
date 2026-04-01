import * as analysisService from '../services/analysis.service.js';

export const getProjectAnalysis = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const method = req.query.method || 'wsm';

    const result = await analysisService.calculateProjectResults(
      projectId,
      method,
    );
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'INCOMPLETE_DATA') {
      return res.status(400).json({
        message:
          'Недостатньо даних. Переконайтеся, що проєкт має альтернативи, критерії та заповнену матрицю оцінок.',
      });
    }
    next(error);
  }
};
