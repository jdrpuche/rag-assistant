import { Request, Response } from 'express';
import { AskQuestionUseCase } from '../../application/useCases/askQuestion';

export class QuestionController {
  constructor(private askUseCase: AskQuestionUseCase) {}

  async ask(req: Request, res: Response) {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }
      const answer = await this.askUseCase.execute(question);
      res.status(200).json({ answer: answer.text, sources: answer.sources.map(s => s.content) });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}