import { ChatMistralAI } from '@langchain/mistralai';
import { ILLMService } from '../domain/interfaces';

export class LLMService implements ILLMService {
  private llm: ChatMistralAI;

  constructor(apiKey: string) {
    this.llm = new ChatMistralAI({
      apiKey,
      modelName: 'mistral-medium-latest'
    });
  }

  async generateAnswer(question: string, context: string): Promise<string> {
    // Limit context size to avoid memory issues
    const maxContextLength = 3000;
    const limitedContext = context.length > maxContextLength 
      ? context.substring(0, maxContextLength) + '...'
      : context;
    
    const prompt = `Context: ${limitedContext}\n\nQuestion: ${question}\n\nAnswer:`;
    const response = await this.llm.invoke(prompt);
    const answer = response.content as string;
    
    // Note: prompt will be garbage collected naturally
    
    return answer;
  }
}