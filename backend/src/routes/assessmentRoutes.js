import { Router } from 'express';
import { createAssessment } from '../controllers/assessmentController.js';
import { validateAssessment } from '../middleware/validateAssessment.js';
const router=Router();
router.post('/',validateAssessment,createAssessment);
export default router;
