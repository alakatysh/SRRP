import { Router } from 'express';
import * as criterionController from '../controllers/criterion.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import {
  validateCreateCriterion,
  validateUpdateCriterion,
} from '../schemas/criterion.schema.js';

const router = Router();

router.get('/', criterionController.getCriteria);
router.get('/:id', criterionController.getCriterionById);
router.post(
  '/',
  validateBody(validateCreateCriterion),
  criterionController.createCriterion,
);
router.patch(
  '/:id',
  validateBody(validateUpdateCriterion),
  criterionController.updateCriterion,
);
router.delete('/:id', criterionController.deleteCriterion);

export default router;
