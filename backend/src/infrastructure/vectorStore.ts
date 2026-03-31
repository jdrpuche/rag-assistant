import { IVectorStore } from '../domain/interfaces';
import { Chunk } from '../domain/entities/document';

export class VectorStore implements IVectorStore {
  private chunks: Chunk[] = [];

  constructor(apiKey: string, indexName: string, embeddings: any) {
    console.log('Using local vector store (in-memory) instead of Pinecone');
  }

  async storeChunks(chunks: Chunk[]): Promise<void> {
    this.chunks.push(...chunks);
    console.log(`Stored ${chunks.length} chunks locally. Total: ${this.chunks.length}`);
  }

  async retrieve(query: string, topK: number): Promise<Chunk[]> {
    // Simple text-based similarity (not using embeddings for now)
    const queryLower = query.toLowerCase();
    const scored = this.chunks.map(chunk => ({
      chunk,
      score: chunk.content.toLowerCase().includes(queryLower) ? 1 : 0
    })).sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map(s => s.chunk);
  }
}