import { Router } from 'express';
import * as evaluationController from '../controllers/evaluation.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { validateUpsertEvaluation } from '../schemas/evaluation.schema.js';

const router = Router();

router.get('/', evaluationController.getEvaluations);
router.put(
  '/',
  validateBody(validateUpsertEvaluation),
  evaluationController.upsertEvaluation,
);
router.delete(
  '/:alternativeId/:criterionId',
  evaluationController.deleteEvaluation,
);

export default router;
