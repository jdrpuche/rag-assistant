import { Router } from 'express';
import { DocumentController } from '../controllers/documentController';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

export const createDocumentRoutes = (controller: DocumentController): Router => {
  const router = Router();
  router.post('/upload', upload.single('file'), controller.upload.bind(controller));
  return router;
};