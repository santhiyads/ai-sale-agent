const CHAT_STATES = require("./chatState.constants");
const OpenAI = require("openai");
const buildRagContext = require("../rag/contextBuilder");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Build AI prompt based on chat state.
 */
function buildPrompt({ state, ragContext, userMessage }) {
  switch (state) {
    case CHAT_STATES.GREETING:
      return `
You are a professional sales assistant.
Greet the user politely and invite them to explore.

Use ONLY the information below.
${ragContext}
`;

    case CHAT_STATES.INTEREST_CHECK:
      return `
You are a sales assistant.
Ask ONE short question to understand user interest.

Use ONLY the information below.
${ragContext}
`;

    case CHAT_STATES.QUALIFICATION:
      return `
You are a sales assistant.
Ask ONE clarifying question (budget, usage, or preference).

User said: "${userMessage || ""}"

Use ONLY the information below.
${ragContext}
`;

    case CHAT_STATES.PRODUCT_PITCH:
      return `
You are a sales assistant.
Recommend the best suitable product.
Mention price and discount clearly.
Do NOT invent details.

User said: "${userMessage || ""}"

Use ONLY the information below.
${ragContext}
`;

    case CHAT_STATES.CTA:
      return `
You are a sales assistant.
Encourage the user to take action using the CTA.
Do NOT negotiate or change price.

Use ONLY the information below.
${ragContext}
`;

    case CHAT_STATES.COMPLETED:
      return `
Thank the user politely and close the conversation.
`;

    default:
      return `
Respond politely using ONLY the information below.
${ragContext}
`;
  }
}

/**
 * Generate AI response using OpenAI
 */
async function generateAIResponse({ state, ragContext, userMessage }) {
  const prompt = buildPrompt({ state, ragContext, userMessage });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",   // fast & cheap
    messages: [
  { role: "system", content: prompt },
  { role: "user", content: userMessage || "Continue" }
],
    temperature: 0.3        // LOW = less hallucination
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateAIResponse
};
