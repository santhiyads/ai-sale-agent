const { generateAIResponse } = require("./aiChat.service");
const INTENT = require("./intent.constants");

async function detectIntentWithAI(message) {
  const prompt = `
You are an intent classifier.

Classify the user message into ONE of the following intents ONLY:
- GREETING
- PRODUCT_QUERY
- OFFER_QUERY
- PRICE_QUERY
- IDENTITY_QUERY
- UNKNOWN

Rules:
- Respond with ONLY the intent label.
- No explanation.
- No punctuation.

User message:
"${message}"
`;

  const result = await generateAIResponse({
    systemPrompt: prompt,
    userMessage: ""
  });

  const intent = result?.trim();

  // 🔒 Safety check
  if (Object.values(INTENT).includes(intent)) {
    return intent;
  }

  return null; // AI unsure
}

module.exports = detectIntentWithAI;
