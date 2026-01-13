const ChatSessionModel = require("../model/ChatSessionModel");
const ChatMessageModel = require("../model/ChatMessageModel");

const { generateAIResponse } = require("../services/aiChat.service");
const { generateSemanticAnswer } = require("../services/semanticAnswer.service");

const buildRagContext = require("../rag/contextBuilder");

const campaignTransformer = require("../transformers/campaign.transformer");
const companyTransformer = require("../transformers/company.transformer");
const productTransformer = require("../transformers/product.transformer");

const { rawLoader } = require("../mock");

const CHAT_STATES = require("../services/chatState.constants");
const { getNextState } = require("../services/chatState.service");

const detectIntent = require("../services/intent.service");
const { canAnswerFromContext } = require("../services/knowledgeJudge.service");

const { fetchIfNeededAndAnswer } =
  require("../services/semanticRag.service");

/* ✅ ADDED: optional D-ID avatar service */
const {
  createAvatarTalk,
  getAvatarTalkStatus
} = require("../services/didAvatar");

exports.sendMessage = async (req, res) => {
  try {
    /* ✅ ADDED: read optional voice_gender */
    const {
      session_id,
      campaign_id,
      message,
      voice_gender
    } = req.body;

    if (!session_id || !campaign_id || !message) {
      return res.status(400).json({
        reply: "session_id, campaign_id and message are required"
      });
    }

    /* --------------------------------------------------
       1️⃣ Load history
    -------------------------------------------------- */
    const history =
      await ChatMessageModel.getLastMessages(session_id, 6);

    /* ✅ ADDED: detect first message */
    const isFirstMessage = history.length === 0;

    /* --------------------------------------------------
       2️⃣ Detect intent
    -------------------------------------------------- */
    const intent = await detectIntent(message, history);
    console.log("DETECTED INTENT:", intent);

    /* --------------------------------------------------
       3️⃣ Find or create session
    -------------------------------------------------- */
    let session =
      await ChatSessionModel.findBySessionId(session_id);

    if (!session) {
      const { rawCompany } =
        rawLoader.loadByCampaignId(campaign_id);

      await ChatSessionModel.create({
        sessionId: session_id,
        campaignId: campaign_id,
        companyId: rawCompany.companyId || 1
      });

      session =
        await ChatSessionModel.findBySessionId(session_id);
    }

    const currentState =
      session.current_state || CHAT_STATES.INIT;

    /* --------------------------------------------------
       4️⃣ Load campaign data
    -------------------------------------------------- */
    const { rawCampaign, rawCompany, rawProducts } =
      rawLoader.loadByCampaignId(campaign_id);

    const campaign = campaignTransformer(rawCampaign);
    const company = companyTransformer(rawCompany);
    const allProducts = productTransformer(rawProducts);

    const products = allProducts.filter(p =>
      campaign.productIds.includes(p.productId)
    );

    /* --------------------------------------------------
       5️⃣ Decide next state
    -------------------------------------------------- */
    const nextState = getNextState({
      currentState,
      campaign
    });

    /* --------------------------------------------------
       6️⃣ Save user message
    -------------------------------------------------- */
    await ChatMessageModel.save({
      sessionId: session_id,
      role: "user",
      content: message,
      intent
    });

    /* --------------------------------------------------
       7️⃣ Build campaign RAG context
    -------------------------------------------------- */
    const ragContext = buildRagContext({
      campaign,
      company,
      products
    });

    /* --------------------------------------------------
       8️⃣ Knowledge sufficiency judge
    -------------------------------------------------- */
    const canAnswer = await canAnswerFromContext({
      ragContext,
      userMessage: message
    });

    let semanticContext = "";

    if (!canAnswer) {
      console.log(
        "🔍 Campaign RAG insufficient → invoking Semantic RAG"
      );

      const semanticResult =
        await fetchIfNeededAndAnswer(
          company.website,
          message
        );

      semanticContext = semanticResult.context || "";
    }

    /* --------------------------------------------------
       9️⃣ Intent-based system hint
    -------------------------------------------------- */
    let systemHint = "";

    if (intent === "GREETING") {
      systemHint = `
You are a friendly sales assistant for ${company.name}.
Start with a warm greeting.
Briefly introduce that you sell premium and customized cake toppers.
Highlight quality, customization, and suitability for birthdays and weddings.
Ask the user what occasion they are buying for.
`;
    }

    if (intent === "OFFER_QUERY") {
      systemHint = `
User is asking about offers.
Act like a sales executive.
Clearly mention current discounts, original price vs offer price,
and encourage the user to choose a product.
`;
    }

    if (intent === "PRODUCT_QUERY" || intent === "PRODUCT_FOLLOWUP") {
      systemHint = `
User wants product details.
Explain the product clearly and confidently.
Mention material, usage, customization options, and best occasions.
Sound helpful and sales-oriented.
`;
    }

    if (intent === "PRICE_QUERY") {
      systemHint = `
User is asking about price.
Mention exact prices clearly.
Include any ongoing offers or discounts.
Reassure about value for money.
`;
    }

    if (intent === "IDENTITY_QUERY") {
      systemHint = `
You are an AI sales assistant for ${company.name}.
Briefly explain who you are and what products you sell.
Keep it professional, friendly, and customer-focused.
`;
    }

    /* --------------------------------------------------
       🔟 Generate final reply
    -------------------------------------------------- */
    let reply;

    if (semanticContext) {
      reply = await generateSemanticAnswer({
        state: nextState,
        ragContext,
        semanticContext,
        history,
        userMessage: message,
        intent,
        systemHint
      });
    } else {
      reply = await generateAIResponse({
        state: nextState,
        ragContext,
        history,
        userMessage: message,
        intent,
        systemHint
      });
    }

    /* ✅ ADDED: OPTIONAL avatar (FAIL-SAFE) */
    let avatarVideo = null;

    if (isFirstMessage) {
      try {
        const talkId = await createAvatarTalk(
          reply,
          voice_gender || "female"
        );

        for (let i = 0; i < 5; i++) {
          const status = await getAvatarTalkStatus(talkId);
          if (status.status === "done") {
            avatarVideo = status.result_url;
            break;
          }
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (err) {
        console.warn("Avatar skipped:", err.message);
      }
    }

    /* --------------------------------------------------
       1️⃣1️⃣ Save AI reply + update state
    -------------------------------------------------- */
    await ChatMessageModel.save({
      sessionId: session_id,
      role: "assistant",
      content: reply
    });

    await ChatSessionModel.updateState(
      session_id,
      nextState
    );

    /* ✅ ADDED: return avatar safely */
    return res.json({
      reply,
      avatar_video: avatarVideo
    });

  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({
      reply: "Server error"
    });
  }
};
