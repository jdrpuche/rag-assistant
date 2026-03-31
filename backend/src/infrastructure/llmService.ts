import { ILLMService } from '../domain/interfaces';

export class LLMService implements ILLMService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateAnswer(question: string, context: string): Promise<string> {
    const { Mistral } = await import('@mistralai/mistralai');
    const client = new Mistral({ apiKey: this.apiKey });

    const maxContextLength = 3000;
    const limitedContext = context.length > maxContextLength
      ? context.substring(0, maxContextLength) + '...'
      : context;

    const prompt = `Context: ${limitedContext}\n\nQuestion: ${question}\n\nAnswer:`;

    const response = await client.chat.complete({
      model: 'mistral-medium-latest',
      messages: [{ role: 'user', content: prompt }]
    });

    return response.choices![0].message.content as string;
  }
}
