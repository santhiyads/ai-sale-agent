const path = require("path");

// Import transformers
const campaignTransformer = require("../transformers/campaign.transformer");
const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");

// Import raw mock JSON
const rawCampaign = require("../mock/campaign.json");
const rawCompany = require("../mock/company.json");
const rawProducts = require("../mock/products.json");

// Import context builder
const buildRagContext = require("../rag/contextBuilder");

// Run transformers
const campaign = campaignTransformer(rawCampaign);
const company = companyTransformer(rawCompany);
const products = productTransformer(rawProducts);

// Build RAG context
const context = buildRagContext({ campaign, company, products });

// Output
console.log("\n========== RAG CONTEXT ==========\n");
console.log(context);
console.log("\n================================\n");
