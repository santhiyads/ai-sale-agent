et’s trace one real request.

STEP A — API CALL
POST /chat/message


Payload:

{
  "session_id": "abc123",
  "campaign_id": 9101,
  "message": "Do you offer customized cake toppers?"
}

STEP B — Controller (chat.controller.js)
1️⃣ Load history
const history = await ChatMessageModel.getLastMessages(session_id, 6);


✔ Used for follow-up intent detection
✔ NOT used for knowledge retrieval

2️⃣ Detect intent
const intent = await detectIntent(message, history);


Hybrid:

AI intent (OpenAI)

Rule fallback

Context follow-up detection

✔ This part is GOOD

3️⃣ Load campaign data
rawLoader.loadByCampaignId(campaign_id);


This loads:

campaign JSON

company JSON

product JSON

⚠️ This is the ONLY knowledge source

4️⃣ Transform data
campaignTransformer
companyTransformer
productTransformer


✔ Cleans data
✔ Normalizes prices
✔ Safe

5️⃣ Build RAG context (IMPORTANT)
const ragContext = buildRagContext({
  campaign,
  company,
  products
});


📌 This is NOT vector RAG
📌 This is STATIC STRING CONTEXT

Example output (simplified):

You are a professional sales assistant for Cake Toppers India.

Company Information:
- Name: Cake Toppers India
- Website: https://caketoppersindia.com

Products:
1) Customized Name Cake Topper
   Price: ₹499 (MRP ₹999)

Boundaries:
- Answer using ONLY the information above
- Do NOT invent information


This string is passed to OpenAI.

6️⃣ AI response generation
generateAIResponse({
  state,
  ragContext,
  history,
  userMessage,
  intent
});


Inside aiChat.service.js:

SYSTEM PROMPT
ONLY use the information below:
${ragContext}


🚨 This is the key restriction

The AI is FORBIDDEN from:

Using web knowledge

Using embeddings

Using website content

Using common sense outside context

🧠 RESULT
If answer exists in campaign data

✅ AI answers correctly

If answer does NOT exist

❌ AI must say “I don’t have that detail”

This is by design, not a bug.
