const { generateAIResponse } = require("./aiChat.service");

/**
 * Final fallback answer using web facts
 */
async function generateWebAnswer({
  state,
  ragContext,
  semanticContext,
  webContext,
  history,
  userMessage,
  intent
}) {
  const SYSTEM_PROMPT = `
You are a PROFESSIONAL AI SALES ASSISTANT.

STRICT RULES:
- NEVER recommend competitors
- NEVER compare prices unless factual
- Use external info ONLY for specifications
- Always relate back to our product if possible
- Never mention data sources

CAMPAIGN DATA:
${ragContext}

COMPANY WEBSITE DATA:
${semanticContext}

EXTERNAL FACTS:
${webContext}
`;

  return generateAIResponse({
    state,
    ragContext: SYSTEM_PROMPT,
    history,
    userMessage,
    intent
  });
}

module.exports = {
  generateWebAnswer
};
