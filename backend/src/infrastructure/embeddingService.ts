import { MistralAIEmbeddings } from '@langchain/mistralai';
import { IEmbeddingService } from '../domain/interfaces';

export class EmbeddingService implements IEmbeddingService {
  private embeddings: MistralAIEmbeddings;

  constructor(apiKey: string) {
    this.embeddings = new MistralAIEmbeddings({
      apiKey,
      modelName: 'mistral-embed'
    });
  }

  getEmbeddings(): MistralAIEmbeddings {
    return this.embeddings;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return await this.embeddings.embedQuery(text);
  }
}