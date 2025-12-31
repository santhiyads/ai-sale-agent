const { generateAIResponse } = require("../services/aiChat.service");
const buildRagContext = require("../rag/contextBuilder");

const campaignTransformer = require("../transformers/campaign.transformer");
const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");

const { rawLoader } = require("../mock");

exports.sendMessage = async (req, res) => {
  try {
    const { message, campaign_id } = req.body;

    if (!campaign_id) {
      return res.status(400).json({ reply: "campaign_id is required" });
    }

    // 1️⃣ Load correct data
    const { rawCampaign, rawCompany, rawProducts } =
      rawLoader.loadByCampaignId(campaign_id);

    // 2️⃣ Transform
    const campaign = campaignTransformer(rawCampaign);
    const company = companyTransformer(rawCompany);
    const allProducts = productTransformer(rawProducts);

    // 3️⃣ Filter products for this campaign ONLY
    const products = allProducts.filter(p =>
      campaign.productIds.includes(p.productId)
    );

    // 4️⃣ Build RAG
    const ragContext = buildRagContext({
      campaign,
      company,
      products
    });

    // 5️⃣ AI response
    const reply = await generateAIResponse({
      state: "PRODUCT_PITCH",
      ragContext,
      userMessage: message
    });

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
};
