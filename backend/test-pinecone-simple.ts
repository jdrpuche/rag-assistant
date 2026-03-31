import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';

async function testPinecone() {
  try {
    console.log('Testing Pinecone API...');
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    });

    const indexName = process.env.PINECONE_INDEX_NAME!;
    console.log(`Checking index: ${indexName}`);

    const index = pinecone.index(indexName);
    const stats = await index.describeIndexStats();

    console.log('✅ Pinecone connection successful!');
    console.log(`Index stats:`, {
      dimension: stats.dimension,
      indexFullness: stats.indexFullness,
      totalRecordCount: stats.totalRecordCount
    });

  } catch (error) {
    console.error('❌ Error testing Pinecone API:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
}

testPinecone();