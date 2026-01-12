require("dotenv").config();

const buildRagContext = require("../rag/contextBuilder");
const { canAnswerFromContext } = require("../services/knowledgeJudge.service");
const { rawLoader } = require("../mock");
const campaignTransformer = require("../transformers/campaign.transformer");
const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");

async function runTest(userMessage) {
  const { rawCampaign, rawCompany, rawProducts } =
    rawLoader.loadByCampaignId(9101);

  const campaign = campaignTransformer(rawCampaign);
  const company = companyTransformer(rawCompany);
  const products = productTransformer(rawProducts).filter(p =>
    campaign.productIds.includes(p.productId)
  );

  const ragContext = buildRagContext({ campaign, company, products });

  const result = await canAnswerFromContext({
    ragContext,
    userMessage
  });

  console.log("User:", userMessage);
  console.log("Can answer from campaign?", result);
  console.log("----------------------------------");
}

(async () => {
  await runTest("Do you offer customized cake toppers?");
  await runTest("What material is used for the cake toppers?");
  await runTest("Compare customized cake topper vs normal topper");
})();
