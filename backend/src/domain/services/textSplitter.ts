export class TextSplitter {
  split(text: string, chunkSize: number = 500, overlap: number = 100): string[] {
    if (!text || text.length === 0) return [];

    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end);

      if (chunk.trim().length > 0) {
        chunks.push(chunk);
      }

      // Move start position forward, ensuring progress
      const nextStart = end - overlap;
      if (nextStart <= start) {
        // If overlap would cause no progress, move forward by chunkSize - overlap
        start = start + chunkSize - overlap;
      } else {
        start = nextStart;
      }

      // Safety check to prevent infinite loops
      if (start >= text.length) break;
    }

    return chunks.length > 0 ? chunks : [text];
  }
}