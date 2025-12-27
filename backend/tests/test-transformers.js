const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");
const campaignTransformer = require("../transformers/campaign.transformer");

const rawCompany = require("../mock/company.json");
const rawProducts = require("../mock/products.json");
const rawCampaign = require("../mock/campaign.json");

console.log("---- Company ----");
console.log(companyTransformer(rawCompany));

console.log("---- Products ----");
console.log(productTransformer(rawProducts));

console.log("---- Campaign ----");
console.log(campaignTransformer(rawCampaign));
