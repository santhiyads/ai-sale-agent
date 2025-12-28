const { generateAIResponse } = require("../services/aiChat.service");
const buildRagContext = require("../rag/contextBuilder");

// IMPORT TRANSFORMERS
const campaignTransformer = require("../transformers/campaign.transformer");
const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");

// IMPORT RAW MOCK DATA
const rawCampaign = require("../mock/campaign.json");
const rawCompany = require("../mock/company.json");
const rawProducts = require("../mock/products.json");

// TRANSFORM DATA (IMPORTANT)
const campaign = campaignTransformer(rawCampaign);
const company = companyTransformer(rawCompany);
const products = productTransformer(rawProducts);

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // 1️⃣ BUILD REAL RAG CONTEXT
    const ragContext = buildRagContext({
      campaign,
      company,
      products
    });

    // 2️⃣ CALL AI WITH REAL DATA
    const aiReply = await generateAIResponse({
      state: "PRODUCT_PITCH",
      ragContext,
      userMessage: message
    });

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      reply: "Sorry, something went wrong."
    });
  }
};
