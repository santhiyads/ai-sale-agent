const detectIntentWithAI = require("./intent.ai.service");
const detectIntentWithRules = require("./intent.rule.service");
const INTENT = require("./intent.constants");

/**
 * Hybrid intent detection
 * - AI first
 * - Rule fallback
 * - Context-aware follow-up
 */
async function detectIntent(message, history = []) {
  let intent = INTENT.UNKNOWN;

  // 1️⃣ Try AI intent
  try {
    const aiIntent = await detectIntentWithAI(message);
    if (aiIntent) {
      intent = aiIntent;
    }
  } catch (err) {
    console.warn("AI intent failed, falling back to rules");
  }

  // 2️⃣ Rule fallback if AI failed
  if (intent === INTENT.UNKNOWN) {
    intent = detectIntentWithRules(message) || INTENT.UNKNOWN;
  }

  // 3️⃣ CONTEXT-AWARE FOLLOW-UP (KEY FIX)
  if (intent === INTENT.UNKNOWN && history.length) {
    const lastAIMessage = [...history]
      .reverse()
      .find(m => m.role === "assistant");

    if (
      lastAIMessage &&
      (
        lastAIMessage.content.includes("Cake Topper") ||
        lastAIMessage.content.includes("T-Shirt") ||
        lastAIMessage.content.includes("Topper")
      )
    ) {
      return INTENT.PRODUCT_FOLLOWUP;
    }
  }

  return intent;
}

module.exports = detectIntent;
