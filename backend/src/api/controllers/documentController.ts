import { Request, Response } from 'express';
import { UploadDocumentUseCase } from '../../application/useCases/uploadDocument';

export class DocumentController {
  constructor(private uploadUseCase: UploadDocumentUseCase) {}

  async upload(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Validar tamaño del archivo (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
      }

      // Validar tipo de archivo
      if (!file.mimetype.includes('pdf')) {
        return res.status(400).json({ error: 'Only PDF files are allowed.' });
      }

      console.log(`Processing file: ${file.originalname}, size: ${file.size} bytes`);

      const document = await this.uploadUseCase.execute(file.buffer, file.originalname);
      res.status(200).json({ message: 'Document uploaded and processed', documentId: document.id });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}