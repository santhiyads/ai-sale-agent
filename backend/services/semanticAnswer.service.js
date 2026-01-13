const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate final AI answer using:
 * - Campaign RAG (PRIMARY, trusted)
 * - Semantic RAG (SECONDARY, website)
 */
async function generateSemanticAnswer({
  state,
  ragContext,
  semanticContext = "",
  history = [],
  userMessage,
  intent,
  systemHint = ""
}) {
  const SYSTEM_PROMPT = `
You are a PROFESSIONAL AI SALES ASSISTANT.

STRICT RULES (MANDATORY):
- You represent ONLY this company
- Campaign data is the PRIMARY source of truth
- Website knowledge is SECONDARY and only used if campaign data is insufficient
- NEVER invent facts
- NEVER mention competitors unless explicitly asked
- NEVER say phrases like "based on the website"
- NEVER reveal internal sources
- ALWAYS answer directly
- After answering, ask ONE short sales follow-up question

CURRENT CHAT STATE: ${state}
CURRENT USER INTENT: ${intent}

${systemHint}

====================
CAMPAIGN DATA (PRIMARY)
====================
${ragContext}

====================
WEBSITE KNOWLEDGE (SECONDARY)
====================
${semanticContext}
`;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map(h => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.content
    })),
    { role: "user", content: userMessage }
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.2
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateSemanticAnswer
};
