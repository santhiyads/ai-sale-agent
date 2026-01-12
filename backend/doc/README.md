🧠 AI Sales Chat Backend – Documentation
Overview

This backend powers an AI-driven sales chat system designed for ad campaigns.
It combines rule-based governance, intent detection, and AI responses to deliver controlled, sales-focused conversations.

The system is built to be:

Campaign-aware

Product-restricted

Safe from hallucinations

Easily extensible (RAG, web search, comparisons)

🏗️ High-Level Architecture
Client (Web / App)
   ↓
Express API (/chat/message)
   ↓
Chat Controller
   ↓
Intent Detection (AI + Rules)
   ↓
Campaign & Company Context
   ↓
Rule-Based RAG Context
   ↓
OpenAI Response Generation
   ↓
MySQL (Sessions & Messages)

📁 Project Structure
backend/
│
├── app.js                 # Express app setup
├── server.js              # Server entry point
│
├── config/
│   ├── db.js              # MySQL connection pool
│   └── redisClient.js     # Redis client (future caching)
│
├── routes/
│   └── chat.routes.js     # Chat API routes
│
├── controllers/
│   └── chat.controller.js # Main chat orchestration logic
│
├── services/
│   ├── aiChat.service.js  # OpenAI interaction + system prompt
│   ├── intent.service.js  # Hybrid intent detection
│   ├── intent.rule.service.js
│   ├── intent.ai.service.js
│   ├── intent.constants.js
│   ├── chatState.service.js
│   └── chatState.constants.js
│
├── rag/
│   └── buildRagContext.js # Rule-based RAG context builder
│
├── transformers/
│   ├── campaign.transformer.js
│   ├── company.transformer.js
│   └── product.transformer.js
│
├── model/
│   ├── ChatSessionModel.js
│   └── ChatMessageModel.js
│
├── scripts/
│   ├── initDb.js          # Database schema setup
│   └── ingestWebsiteLangChain.js # Semantic RAG (website ingest)
│
├── mock/
│   ├── campaigns/
│   ├── companies/
│   ├── products/
│   └── index.js           # Mock data loader
│
├── tests/                 # Manual test scripts (non-production)
│
└── .env                   # Environment variables (not committed)

🔑 Core Concepts
1️⃣ Campaign-First Design

Every chat session is tied to a campaign

Campaign defines:

allowed products

chat behavior

targeting rules

AI cannot promote products outside the campaign

2️⃣ Rule-Based RAG (Primary Knowledge Source)

File: rag/buildRagContext.js

This builds a strict, deterministic context containing:

Company information

Campaign rules

Active products (with price & discount)

Explicit boundaries

The AI is instructed to:

Use ONLY this information

Never invent prices or offers

Never compare external brands

Always ask a sales follow-up question

This prevents hallucinations and keeps answers compliant.

3️⃣ Intent Detection (Hybrid)

File: services/intent.service.js

Intent detection uses:

AI-based intent classification

Rule-based fallback

Context-aware follow-up detection

Supported intents:

GREETING

PRODUCT_QUERY

OFFER_QUERY

PRICE_QUERY

PRODUCT_FOLLOWUP

IDENTITY_QUERY

UNKNOWN

This allows accurate routing of user questions.

4️⃣ Chat State Machine

Files:

chatState.constants.js

chatState.service.js

Chat progresses through defined states:

INIT → GREETING → INTEREST_CHECK → QUALIFICATION
→ PRODUCT_PITCH → CTA → COMPLETED


State transitions depend on campaign behavior.

5️⃣ AI Response Generation

File: services/aiChat.service.js

Key features:

Strong SYSTEM prompt enforcing sales behavior

Uses:

chat state

detected intent

conversation history

rule-based RAG context

Low temperature to reduce hallucinations

Model used:

gpt-4o-mini (fast & stable)

6️⃣ Database Design
Tables:

chat_sessions

session_id

campaign_id

company_id

current_state

completion flag

chat_messages

session_id

role (user / assistant)

content

intent

timestamps

Database script:

scripts/initDb.js

7️⃣ Semantic RAG (Optional / Experimental)

File:

scripts/ingestWebsiteLangChain.js


This module:

Scrapes company website

Chunks content

Creates embeddings

Stores in MemoryVectorStore

⚠️ Currently not wired into production flow
Used for experimentation and future expansion.

🚀 Running the Backend
Install dependencies
npm install

Initialize database
node scripts/initDb.js

Start server
node server.js


Health check:

GET /health

🔐 Environment Variables
OPENAI_API_KEY=your_key_here

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=****
DB_NAME=ai_ads

REDIS_URL=redis://localhost:6379
MAX_SCRAPE_PAGES=300

📌 Integration Notes

API Endpoint:

POST /chat/message


Required payload:

{
  "session_id": "string",
  "campaign_id": 9101,
  "message": "user message"
}


Response:

{
  "reply": "AI response"
}

🧭 Current Limitations (By Design)

Only campaign products are promoted

No competitor or cross-product comparisons

No external web search in production flow

Semantic RAG not yet integrated

These are intentional and will be addressed in Phase 2.

🛣️ Roadmap (Next Phase)

Hybrid RAG (Rule + Semantic + Web)

Same-brand product comparison

Controlled web augmentation

Redis caching for RAG results

README update with new architecture