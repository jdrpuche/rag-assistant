import { Document, Chunk } from '../../domain/entities/document';
import { TextSplitter } from '../../domain/services/textSplitter';
import { IEmbeddingService, IVectorStore, IPDFProcessor } from '../../domain/interfaces';

export class UploadDocumentUseCase {
  constructor(
    private pdfProcessor: IPDFProcessor,
    private textSplitter: TextSplitter,
    private embeddingService: IEmbeddingService,
    private vectorStore: IVectorStore
  ) {}

  async execute(file: Buffer, filename: string): Promise<Document> {
    const timeout = 300000; // 5 minutos timeout
    const startTime = Date.now();

    try {
      console.log(`Processing document: ${filename}`);

      // Paso 1: Extraer texto del PDF
      console.log('Step 1: Extracting text from PDF...');
      const text = await this.pdfProcessor.extractText(file);
      console.log(`Extracted text length: ${text.length} characters`);
      
      // Clear file buffer from memory immediately after extraction
      // Note: file parameter cannot be reassigned, but buffer will be garbage collected

      // Paso 2: Dividir el texto en chunks
      console.log('Step 2: Splitting text into chunks...');
      let chunksText = this.textSplitter.split(text);
      
      // Limitar a máximo 50 chunks para evitar memoria excesiva
      const MAX_CHUNKS = 50;
      if (chunksText.length > MAX_CHUNKS) {
        console.log(`Limiting chunks from ${chunksText.length} to ${MAX_CHUNKS}`);
        chunksText = chunksText.slice(0, MAX_CHUNKS);
      }
      console.log(`Created ${chunksText.length} chunks`);

      // Paso 3: Generar embeddings para cada chunk (ONE BY ONE, sin acumular)
      console.log('Step 3: Generating embeddings and storing immediately...');
      const chunks: Chunk[] = [];
      for (let i = 0; i < chunksText.length; i++) {
        // Verificar timeout
        if (Date.now() - startTime > timeout) {
          throw new Error('Processing timeout exceeded');
        }

        console.log(`Processing chunk ${i + 1}/${chunksText.length}`);
        try {
          const embedding = await this.embeddingService.generateEmbedding(chunksText[i]);
          console.log(`Generated embedding with ${embedding.length} dimensions`);
          const chunk = new Chunk(`${filename}-${i}`, chunksText[i], embedding);
          
          // Store immediately to avoid memory accumulation
          await this.vectorStore.storeChunks([chunk]);
          console.log(`Stored chunk ${i + 1} to vector store`);
          
          // Don't keep chunk in memory - we already stored it
          // Chunks will not be accumulating in array anymore
          
          // Force garbage collection after every chunk
          if (global.gc) {
            global.gc();
          }
          // Small delay to allow GC to work and avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 150));
          
        } catch (embeddingError) {
          console.error(`Error generating embedding for chunk ${i}:`, embeddingError);
          throw new Error(`Failed to generate embedding for chunk ${i}: ${embeddingError instanceof Error ? embeddingError.message : String(embeddingError)}`);
        }
      }

      console.log('Successfully stored all chunks in vector store');

      // Paso 4: Crear y retornar el documento
      // Use empty content to avoid memory issues - chunks are already in vector store
      const document = new Document(filename, filename, `[Document stored with ${chunksText.length} chunks]`, []);
      console.log('Document processing completed successfully');
      return document;

    } catch (error) {
      console.error('Error in UploadDocumentUseCase:', error);
      if (error instanceof Error) {
        throw new Error(`Document upload failed: ${error.message}`);
      }
      throw new Error(`Document upload failed: ${String(error)}`);
    }
  }
}