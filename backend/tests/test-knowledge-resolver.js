require("dotenv").config();

const { resolveKnowledgeNeed } = require("../services/knowledgeResolver.service");
const INTENT = require("../services/intent.constants");

// Mock campaign (minimal – only what is needed)
const mockCampaign = {
  campaignId: 9101,
  campaignName: "Cake Topper Campaign"
};

// Mock products (campaign products only)
const mockProducts = [
  {
    productId: 201,
    productName: "Customized Name Cake Topper"
  },
  {
    productId: 205,
    productName: "Happy Birthday Cake Topper"
  }
];

// Helper to run tests cleanly
function runTest({ title, intent, message }) {
  console.log("\n==============================");
  console.log("TEST:", title);
  console.log("User Message:", message);

  const result = resolveKnowledgeNeed({
    intent,
    userMessage: message,
    campaign: mockCampaign,
    products: mockProducts
  });

  console.log("Knowledge Decision:", result);
}

// -------------------------------
// TEST CASES
// -------------------------------

// 1️⃣ Rule data sufficient
runTest({
  title: "Rule data sufficient (product exists in campaign)",
  intent: INTENT.PRODUCT_QUERY,
  message: "Do you offer customized cake toppers?"
});

// 2️⃣ Missing product detail → semantic RAG needed
runTest({
  title: "Missing product detail (material, manufacturing, etc.)",
  intent: INTENT.UNKNOWN,
  message: "What material is used for the cake toppers?"
});

// 3️⃣ Product follow-up
runTest({
  title: "Product follow-up question",
  intent: INTENT.PRODUCT_FOLLOWUP,
  message: "Is it reusable?"
});

// 4️⃣ Product not in campaign
runTest({
  title: "Product not in campaign",
  intent: INTENT.PRODUCT_QUERY,
  message: "Do you have wooden cake toppers?"
});

// 5️⃣ Same-brand comparison
runTest({
  title: "Same-brand comparison",
  intent: INTENT.PRODUCT_QUERY,
  message: "Compare customized cake topper vs normal birthday topper"
});

// 6️⃣ Generic comparison (web needed)
runTest({
  title: "Comparison requiring web RAG",
  intent: INTENT.PRODUCT_QUERY,
  message: "Compare Apple iPhone 11 and iPhone 12"
});

console.log("\n✅ Milestone 1 knowledge resolver tests completed\n");
