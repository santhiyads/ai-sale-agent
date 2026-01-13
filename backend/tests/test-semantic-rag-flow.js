require("dotenv").config();

const buildRagContext = require("../rag/contextBuilder");
const { canAnswerFromContext } = require("../services/knowledgeJudge.service");
const { resolveKnowledgeNeed } = require("../services/knowledgeResolver.service");

const {
  initSemanticRag,
  getSemanticContext
} = require("../services/semanticRag.service");

const { getWebContext } = require("../services/webRag.service");

const { rawLoader } = require("../mock");
const campaignTransformer = require("../transformers/campaign.transformer");
const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");

async function runTest(userMessage) {
  console.log("\n==============================");
  console.log("USER QUESTION:", userMessage);

  // 1️⃣ Load mock campaign
  const { rawCampaign, rawCompany, rawProducts } =
    rawLoader.loadByCampaignId(9101);

  const campaign = campaignTransformer(rawCampaign);
  const company = companyTransformer(rawCompany);
  const allProducts = productTransformer(rawProducts);

  const products = allProducts.filter(p =>
    campaign.productIds.includes(p.productId)
  );

  // 2️⃣ Build base RAG
  const ragContext = buildRagContext({
    campaign,
    company,
    products
  });

  // 3️⃣ AI Knowledge Judge
  const canAnswer = await canAnswerFromContext({
    ragContext,
    userMessage
  });

  if (canAnswer) {
    console.log("🟢 Campaign RAG sufficient — no fallback needed");
    return;
  }

  // 4️⃣ Decide deeper knowledge
  const decision = resolveKnowledgeNeed({
    intent: "UNKNOWN",
    userMessage,
    campaign,
    products
  });

  console.log("🔎 Knowledge Decision:", decision);

  // 5️⃣ Semantic RAG
  if (decision.needsSemanticRag) {
    await initSemanticRag(company.companyId, company.website);

    const semanticContext = await getSemanticContext(
      company.companyId,
      userMessage
    );

    console.log("\n--- SEMANTIC CONTEXT (preview) ---");
    console.log(semanticContext.slice(0, 300));
    console.log("--- END SEMANTIC CONTEXT ---");

    // 6️⃣ Web RAG (LAST fallback)
    if (decision.needsWebRag) {
      const webContext = await getWebContext(userMessage);

      console.log("\n--- WEB CONTEXT ---");
      console.log(webContext || "No external data found");
      console.log("--- END WEB CONTEXT ---");
    }
  }

  console.log("==============================");
}

(async () => {
  console.log("🚀 STARTING WEB RAG FLOW TEST");

  await runTest("Do you offer customized cake toppers?");
  await runTest("What material is used for the cake toppers?");
  await runTest("Compare customized cake topper vs normal topper");
  await runTest("Compare birthday  and  wedding cake toppers");

  console.log("\n✅ Web RAG flow test completed");
})();
