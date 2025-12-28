const CHAT_STATES = require("./chatState.constants");

/**
 * Decide next chat state based on:
 * - current state
 * - campaign behavior
 */
function getNextState({ currentState, campaign }) {
  const behavior = campaign.adBehavior;

  // 🔒 If chat is not enabled, end immediately
  if (!campaign.chatRules.enableChat) {
    return CHAT_STATES.COMPLETED;
  }

  switch (currentState) {
    case CHAT_STATES.INIT:
      return CHAT_STATES.GREETING;

    case CHAT_STATES.GREETING:
      // Question-based ads go through full flow
      if (behavior === "QUESTION_BASED") {
        return CHAT_STATES.INTEREST_CHECK;
      }
      // Other ads skip questions
      return CHAT_STATES.PRODUCT_PITCH;

    case CHAT_STATES.INTEREST_CHECK:
      return CHAT_STATES.QUALIFICATION;

    case CHAT_STATES.QUALIFICATION:
      return CHAT_STATES.PRODUCT_PITCH;

    case CHAT_STATES.PRODUCT_PITCH:
      return CHAT_STATES.CTA;

    case CHAT_STATES.CTA:
      return CHAT_STATES.COMPLETED;

    default:
      return CHAT_STATES.COMPLETED;
  }
}

module.exports = {
  getNextState
};
