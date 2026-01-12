const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * AI Knowledge Sufficiency Judge
 * Returns: true (YES) or false (NO)
 */
async function canAnswerFromContext({ ragContext, userMessage }) {
  const SYSTEM_PROMPT = `
You are a strict validator.

Your task:
- Decide whether the user's question can be fully and correctly answered
  using ONLY the information provided in the context.
- Do NOT assume or infer missing details.
- Do NOT use external knowledge.
- Respond with ONLY one word: YES or NO.
`;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `
CONTEXT:
${ragContext}

USER QUESTION:
${userMessage}
`
    }
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0
  });

  const answer = response.choices[0].message.content.trim().toUpperCase();

  return answer === "YES";
}

module.exports = {
  canAnswerFromContext
};
