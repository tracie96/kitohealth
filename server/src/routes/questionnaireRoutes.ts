import { Router } from 'express';
import { createQuestionnaire, getQuestionnaire, getQuestionnaireById, submitAnswers } from '../controller/questionnaireController';

const router = Router();

// Create a new questionnaire
router.post('/', createQuestionnaire);


// Get all questionnaire
router.get('/', getQuestionnaire);

// Get by by ID
router.get('/:id', getQuestionnaireById);

// Submit my answers and get results
router.post('/:id/submit', submitAnswers);

export default router;
