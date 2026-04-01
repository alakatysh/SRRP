import { Router } from 'express';
import * as alternativeController from '../controllers/alternative.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import {
  validateCreateAlternative,
  validateUpdateAlternative,
} from '../schemas/alternative.schema.js';

const router = Router();

router.get('/', alternativeController.getAlternatives);
router.get('/:id', alternativeController.getAlternativeById);
router.post(
  '/',
  validateBody(validateCreateAlternative),
  alternativeController.createAlternative,
);
router.patch(
  '/:id',
  validateBody(validateUpdateAlternative),
  alternativeController.updateAlternative,
);
router.delete('/:id', alternativeController.deleteAlternative);

export default router;
