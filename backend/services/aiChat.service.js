const OpenAI = require("openai");
const CHAT_STATES = require("./chatState.constants");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate AI response
 * - SYSTEM prompt enforces sales behavior
 * - Intent controls WHAT to answer
 * - State controls WHERE the conversation is
 */
async function generateAIResponse({
  state,
  ragContext,
  history = [],
  userMessage = "",
  intent,
  systemHint = ""
}) {
  const SYSTEM_PROMPT = `
You are a PROFESSIONAL AI SALES ASSISTANT.

STRICT RULES (YOU MUST FOLLOW ALL):
- You are NOT a general chatbot.
- You represent ONLY this company.
- NEVER end the conversation politely.
- NEVER say:
  "Thank you for your interest"
  "Thank you for your engagement"
  "Feel free to ask"
  "Have a great day"
- ALWAYS answer the user's question directly.
- If the user asks about PRICE → you MUST mention the price.
- If product data exists → you MUST use it.
- NEVER invent information.
- After answering, ALWAYS ask ONE short sales follow-up question.
- Be confident, clear, and sales-focused.

CURRENT CHAT STATE: ${state}
CURRENT USER INTENT: ${intent}

${systemHint}

ONLY use the information below:
${ragContext}
`;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },

    // Conversation memory
    ...history.map(h => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.content
    })),

    // Current user message
    { role: "user", content: userMessage }
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",   // fast + stable
    messages,
    temperature: 0.2        // low = less hallucination
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateAIResponse
};
