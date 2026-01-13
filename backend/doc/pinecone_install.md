✅ STEP 1: Create Pinecone Project (once)

Go to https://www.pinecone.io

Create account

Create Index:

Name: semantic-rag

Dimensions: 1536 (IMPORTANT – OpenAI embeddings)

Metric: cosine

Copy:

API Key

Environment

Index Name

✅ STEP 2: Update .env

Add ONLY this (nothing else):

PINECONE_API_KEY=xxxxx
PINECONE_ENV=us-east-1
PINECONE_INDEX=semantic-rag


(keep your OpenAI key as-is)

✅ STEP 3: Install Pinecone deps (SAFE)
npm install @pinecone-database/pinecone --legacy-peer-deps


This does NOT trigger native builds. Safe on Windows.cls
