import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PDFProcessor } from './infrastructure/pdfProcessor';
import { EmbeddingServiceLocal } from './infrastructure/embeddingServiceLocal';
import { VectorStore } from './infrastructure/vectorStore';
import { LLMService } from './infrastructure/llmService';
import { TextSplitter } from './domain/services/textSplitter';
import { UploadDocumentUseCase } from './application/useCases/uploadDocument';
import { AskQuestionUseCase } from './application/useCases/askQuestion';
import { DocumentController } from './api/controllers/documentController';
import { QuestionController } from './api/controllers/questionController';
import { createDocumentRoutes } from './api/routes/documentRoutes';
import { createQuestionRoutes } from './api/routes/questionRoutes';

const app = express();
app.use(cors());
app.use(express.json());

// Debug: log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const port = process.env.PORT || 3000;

// Infrastructure
const pdfProcessor = new PDFProcessor();
const embeddingService = new EmbeddingServiceLocal();
const vectorStore = new VectorStore(process.env.PINECONE_API_KEY!, process.env.PINECONE_INDEX_NAME!, embeddingService);
const llmService = new LLMService(process.env.MISTRAL_API_KEY!);

// Domain
const textSplitter = new TextSplitter();

// Application
const uploadUseCase = new UploadDocumentUseCase(pdfProcessor, textSplitter, embeddingService, vectorStore);
const askUseCase = new AskQuestionUseCase(embeddingService, vectorStore, llmService);

// API
const documentController = new DocumentController(uploadUseCase);
const questionController = new QuestionController(askUseCase);

app.use('/api/documents', createDocumentRoutes(documentController));
app.use('/api/questions', createQuestionRoutes(questionController));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});