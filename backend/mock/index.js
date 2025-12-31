// backend/mock/index.js

const campaign1 = require("./campaigns/campaign1.json");
const campaign2 = require("./campaigns/campaign2.json");
const campaign3 = require("./campaigns/campaign3.json");

const company1 = require("./companies/company1.json");
const company2 = require("./companies/company2.json");
const company3 = require("./companies/company3.json");

const products1 = require("./products/products1.json");
const products2 = require("./products/products2.json");
const products3 = require("./products/products3.json");

function loadByCampaignId(campaignId) {
  switch (Number(campaignId)) {
    case 9101:
      return { rawCampaign: campaign1, rawCompany: company1, rawProducts: products1 };
    case 9201:
      return { rawCampaign: campaign2, rawCompany: company2, rawProducts: products2 };
    case 9301:
      return { rawCampaign: campaign3, rawCompany: company3, rawProducts: products3 };
    default:
      throw new Error("Invalid campaign_id");
  }
}

module.exports = {
  rawLoader: { loadByCampaignId }
};
