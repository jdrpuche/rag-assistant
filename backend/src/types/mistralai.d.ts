declare module '@mistralai/mistralai' {
  export class Mistral {
    constructor(options: { apiKey: string });
    chat: {
      complete(options: {
        model: string;
        messages: Array<{ role: string; content: string }>;
      }): Promise<{
        choices: Array<{ message: { content: string } }>;
      }>;
    };
  }
}
