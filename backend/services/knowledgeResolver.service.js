const INTENT = require("./intent.constants");

/**
 * Decide if additional knowledge is required
 * This does NOT fetch data – only decides
 */
function resolveKnowledgeNeed({
  intent,
  userMessage = "",
  campaign,
  products = []
}) {
  const text = userMessage.toLowerCase();

  // 🔹 Rule 1: comparison intent
  if (
    text.includes("compare") ||
    text.includes("difference") ||
    text.includes("vs") ||
    text.includes("better than")
  ) {
    return {
      needsSemanticRag: true,
      needsWebRag: true,
      reason: "comparison"
    };
  }

  // 🔹 Rule 2: product not in campaign
  const campaignProductNames = products.map(p =>
    p.productName.toLowerCase()
  );

  const mentionsUnknownProduct =
    campaignProductNames.length &&
    !campaignProductNames.some(name => text.includes(name));

  if (mentionsUnknownProduct && intent === INTENT.PRODUCT_QUERY) {
    return {
      needsSemanticRag: true,
      needsWebRag: false,
      reason: "product_not_in_campaign"
    };
  }

  // 🔹 Rule 3: follow-up with missing info
  if (
    intent === INTENT.PRODUCT_FOLLOWUP ||
    intent === INTENT.UNKNOWN
  ) {
    return {
      needsSemanticRag: true,
      needsWebRag: false,
      reason: "missing_info"
    };
  }

  // 🔹 Default: rule-based data is enough
  return {
    needsSemanticRag: false,
    needsWebRag: false,
    reason: "rule_data_sufficient"
  };
}

module.exports = {
  resolveKnowledgeNeed
};
