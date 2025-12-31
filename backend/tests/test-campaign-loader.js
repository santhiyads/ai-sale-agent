// backend/tests/test-campaign-loader.js

const { rawLoader } = require("../mock");
const campaignTransformer = require("../transformers/campaign.transformer");
const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");

function testCampaign(campaignId) {
  console.log("\n==============================");
  console.log("TESTING CAMPAIGN:", campaignId);
  console.log("==============================");

  const { rawCampaign, rawCompany, rawProducts } =
    rawLoader.loadByCampaignId(campaignId);

  const campaign = campaignTransformer(rawCampaign);
  const company = companyTransformer(rawCompany);
  const products = productTransformer(rawProducts);

  const filteredProducts = products.filter(p =>
    campaign.productIds.includes(p.productId)
  );

  console.log("Company:", company.companyName);
  console.log("Campaign:", campaign.campaignName);
  console.log("Allowed Product IDs:", campaign.productIds);
  console.log(
    "Products sent to chat:",
    filteredProducts.map(p => `${p.productName} (₹${p.price})`)
  );
}

// 🔽 TEST ALL CAMPAIGNS
testCampaign(9301); // Bewakoof
testCampaign(9201); // Titan
testCampaign(9101); // Cake Toppers
