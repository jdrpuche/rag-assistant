import { Router } from 'express';
import { QuestionController } from '../controllers/questionController';

export const createQuestionRoutes = (controller: QuestionController): Router => {
  const router = Router();
  router.post('/ask', controller.ask.bind(controller));
  return router;
};