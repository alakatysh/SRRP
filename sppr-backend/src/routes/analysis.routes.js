import { Router } from 'express';
import * as analysisController from '../controllers/analysis.controller.js';

const router = Router();

router.get('/:projectId', analysisController.getProjectAnalysis);

export default router;
