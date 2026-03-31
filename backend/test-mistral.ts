import 'dotenv/config';
import { MistralAIEmbeddings } from '@langchain/mistralai';

async function testMistralAPI() {
  try {
    console.log('Testing Mistral AI API...');
    const embeddings = new MistralAIEmbeddings({
      apiKey: process.env.MISTRAL_API_KEY!,
      modelName: 'mistral-embed'
    });

    console.log('Generating test embedding...');
    const testText = 'This is a test for the Mistral AI embedding API.';
    const embedding = await embeddings.embedQuery(testText);

    console.log(`✅ Success! Generated embedding with ${embedding.length} dimensions`);
    console.log(`First 5 values: [${embedding.slice(0, 5).join(', ')}]`);

  } catch (error) {
    console.error('❌ Error testing Mistral AI API:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

testMistralAPI();