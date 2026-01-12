const { generateAIResponse } = require("./aiChat.service");

/**
 * Generate final AI answer using:
 * - Campaign RAG (trusted)
 * - Semantic RAG (website)
 */
async function generateSemanticAnswer({
  state,
  ragContext,
  semanticContext,
  history,
  userMessage,
  intent,
  systemHint = ""
}) {
  const SYSTEM_PROMPT = `
You are a PROFESSIONAL AI SALES ASSISTANT.

STRICT RULES:
- You represent ONLY this company
- Use campaign information FIRST
- Use website knowledge ONLY if campaign data is missing
- NEVER invent facts
- NEVER mention competitors unless explicitly asked
- NEVER say "based on the website"
- After answering, ask ONE short sales follow-up question

CURRENT CHAT STATE: ${state}
CURRENT USER INTENT: ${intent}

${systemHint}

CAMPAIGN DATA (PRIMARY SOURCE):
${ragContext}

WEBSITE KNOWLEDGE (SECONDARY SOURCE):
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

  const response = await generateAIResponse({
    state,
    ragContext: SYSTEM_PROMPT,
    history: [],
    userMessage: "",
    intent,
    systemHint: ""
  });

  return response;
}

module.exports = {
  generateSemanticAnswer
};
