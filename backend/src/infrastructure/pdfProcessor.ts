import pdfParse from 'pdf-parse';
import { IPDFProcessor } from '../domain/interfaces';

export class PDFProcessor implements IPDFProcessor {
  async extractText(buffer: Buffer): Promise<string> {
    try {
      // Verificar que el buffer no esté vacío
      if (!buffer || buffer.length === 0) {
        throw new Error('El archivo está vacío');
      }

      // Verificar que sea un PDF válido (comienza con %PDF-)
      const header = buffer.subarray(0, 5).toString();
      if (!header.startsWith('%PDF-')) {
        throw new Error('El archivo no es un PDF válido. Asegúrate de subir un archivo PDF.');
      }

      const data = await pdfParse(buffer);
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('El PDF no contiene texto extraíble');
      }
      return data.text;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error procesando PDF: ${error.message}`);
      }
      throw new Error('Error desconocido procesando el PDF');
    }
  }
}