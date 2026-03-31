import { IEmbeddingService } from '../domain/interfaces';
import crypto from 'crypto';

export class EmbeddingServiceLocal implements IEmbeddingService {
  private modelLoaded = true;
  private embeddingDim = 1024;

  constructor() {
    console.log('Using lightweight local embeddings (hash-based)');
  }

  getEmbeddings(): any {
    return this;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Generate a deterministic embedding based on text hash
      const hash = crypto.createHash('sha256').update(text).digest();
      const embedding: number[] = [];
      
      // Create embedding vector from hash bytes
      for (let i = 0; i < this.embeddingDim; i++) {
        // Use modulo to create values between -1 and 1
        const byteIndex = i % hash.length;
        const normalized = (hash[byteIndex] - 128) / 128;
        embedding.push(normalized);
      }
      
      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(embedding);
    }
    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.generateEmbedding(text);
  }
}
