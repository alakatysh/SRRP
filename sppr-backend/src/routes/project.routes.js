import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import {
  validateCreateProject,
  validateUpdateProject,
} from '../schemas/project.schema.js';

const router = Router();

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post(
  '/',
  validateBody(validateCreateProject),
  projectController.createProject,
);
router.patch(
  '/:id',
  validateBody(validateUpdateProject),
  projectController.updateProject,
);
router.delete('/:id', projectController.deleteProject);

export default router;
