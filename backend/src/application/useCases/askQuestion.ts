import { Answer } from '../../domain/entities/document';
import { IEmbeddingService, IVectorStore, ILLMService } from '../../domain/interfaces';

export class AskQuestionUseCase {
  constructor(
    private embeddingService: IEmbeddingService,
    private vectorStore: IVectorStore,
    private llmService: ILLMService
  ) {}

  async execute(question: string): Promise<Answer> {
    const relevantChunks = await this.vectorStore.retrieve(question, 5);
    const context = relevantChunks.map(c => c.content).join('\n');
    const answerText = await this.llmService.generateAnswer(question, context);
    return new Answer(answerText, relevantChunks);
  }
}