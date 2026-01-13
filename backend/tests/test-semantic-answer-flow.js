/**
 * Semantic Answer Integration Test
 * --------------------------------
 * Tests:
 * 1) Campaign-only answer
 * 2) Campaign + Semantic fallback
 */

require("dotenv").config();

const buildRagContext = require("../rag/contextBuilder");
const campaignTransformer = require("../transformers/campaign.transformer");
const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");

const { rawLoader } = require("../mock");

const { canAnswerFromContext } =
  require("../services/knowledgeJudge.service");

const { fetchIfNeededAndAnswer } =
  require("../services/semanticRag.service");

const { generateSemanticAnswer } =
  require("../services/semanticAnswer.service");

const { generateAIResponse } =
  require("../services/aiChat.service");

const CHAT_STATES =
  require("../services/chatState.constants");

(async () => {
  console.log("🚀 STARTING SEMANTIC ANSWER FLOW TEST\n");

  const campaignId = 9101;

  // Load mock data
  const { rawCampaign, rawCompany, rawProducts } =
    rawLoader.loadByCampaignId(campaignId);

  const campaign = campaignTransformer(rawCampaign);
  const company = companyTransformer(rawCompany);
  const products = productTransformer(rawProducts)
    .filter(p => campaign.productIds.includes(p.productId));

  const ragContext = buildRagContext({
    campaign,
    company,
    products
  });

  const tests = [
    {
      label: "Campaign-only question",
      question: "Do you offer customized cake toppers?"
    },
    {
      label: "Semantic fallback question",
      question: "What material is used for the cake toppers?"
    }
  ];

  for (const test of tests) {
    console.log("=================================");
    console.log("TEST:", test.label);
    console.log("USER:", test.question);

    const canAnswer = await canAnswerFromContext({
      ragContext,
      userMessage: test.question
    });

    let reply;

    if (!canAnswer) {
      console.log("🔍 Using Semantic RAG");

      const semanticResult =
        await fetchIfNeededAndAnswer(
          company.website,
          test.question
        );

      reply = await generateSemanticAnswer({
        state: CHAT_STATES.PRODUCT_PITCH,
        ragContext,
        semanticContext: semanticResult.context,
        history: [],
        userMessage: test.question,
        intent: "PRODUCT_QUERY"
      });
    } else {
      console.log("🟢 Using Campaign RAG");

      reply = await generateAIResponse({
        state: CHAT_STATES.PRODUCT_PITCH,
        ragContext,
        history: [],
        userMessage: test.question,
        intent: "PRODUCT_QUERY"
      });
    }

    console.log("\nAI REPLY:\n", reply);
    console.log("=================================\n");
  }

  console.log("✅ Semantic Answer Flow Test Completed");
})();
