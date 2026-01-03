const INTENT = require("./intent.constants");

function detectIntentWithRules(message = "") {
  const text = message.toLowerCase();

  if (["hi", "hello", "hey"].includes(text)) {
    return INTENT.GREETING;
  }

  if (text.includes("offer") || text.includes("discount")) {
    return INTENT.OFFER_QUERY;
  }

  if (text.includes("price") || text.includes("cost")) {
    return INTENT.PRICE_QUERY;
  }

  if (text.includes("shirt") || text.includes("t-shirt")) {
    return INTENT.PRODUCT_QUERY;
  }

  if (text.includes("who are you")) {
    return INTENT.IDENTITY_QUERY;
  }

  return INTENT.UNKNOWN;
}

module.exports = detectIntentWithRules;
