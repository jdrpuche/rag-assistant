import { Chunk } from './entities/document';

export interface IEmbeddingService {
  generateEmbedding(text: string): Promise<number[]>;
}

export interface IVectorStore {
  storeChunks(chunks: Chunk[]): Promise<void>;
  retrieve(query: string, topK: number): Promise<Chunk[]>;
}

export interface IPDFProcessor {
  extractText(buffer: Buffer): Promise<string>;
}

export interface ILLMService {
  generateAnswer(question: string, context: string): Promise<string>;
}