import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';

async function testPinecone() {
  try {
    console.log('Testing Pinecone connection...');
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    });

    console.log('Listing indexes...');
    const indexes = await pinecone.listIndexes();
    console.log('Available indexes:', indexes.indexes?.map(idx => idx.name) || []);

    const indexName = process.env.PINECONE_INDEX_NAME!;
    console.log(`Checking if index '${indexName}' exists...`);

    try {
      const index = pinecone.index(indexName);
      const stats = await index.describeIndexStats();
      console.log('Index stats:', stats);
    } catch (error) {
      console.log('Index does not exist, creating it...');
      await pinecone.createIndex({
        name: indexName,
        dimension: 1024, // Mistral embeddings dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log(`Index '${indexName}' created successfully!`);
    }

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

testPinecone();