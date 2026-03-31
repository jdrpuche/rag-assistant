# RAG Microservices

This project implements a RAG (Retrieval Augmented Generation) virtual assistant using Domain-Driven Design (DDD) with an API-first approach.

## Architecture

- **Backend**: TypeScript + LangChain
- **Vector Store**: Pinecone
- **LLM**: Mistral Medium 3.1 (mistral-medium-latest)
- **Frontend**: Simple web client

## Project Structure

- `/backend`: REST API with DDD architecture
  - `/domain`: Entities and business logic
  - `/application`: Use cases
  - `/infrastructure`: Implementations (Pinecone, Mistral, PDF processing)
  - `/api`: Controllers and routes
- `/frontend`: Simple web client

## Setup

1. **Backend**:
   - `cd backend`
   - `npm install`
   - Copy `.env.example` to `.env` and fill in your API keys:
     - `PINECONE_API_KEY`
     - `PINECONE_INDEX_NAME`
     - `MISTRAL_API_KEY`
     - `PORT=3000`

2. **Frontend**:
   - `cd frontend`
   - `npm install`

## Running Locally

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm start`
3. Open `http://localhost:3001` in your browser

## API Endpoints

- `POST /api/documents/upload`: Upload a PDF file
- `POST /api/questions/ask`: Ask a question to the assistant

## Deployment

- **Backend**: Use the provided `Dockerfile` to deploy on Railway
- **Frontend**: Deploy the static files or the Express server on Railway

Ensure the frontend's `API_BASE` in `script.js` points to the deployed backend URL.