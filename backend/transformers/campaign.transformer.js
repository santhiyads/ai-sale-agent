// Internal ad behavior types used by backend logic.
// Website ad names should NOT be used directly in logic.
const AD_BEHAVIOR = {
  VIEW_ONLY: "VIEW_ONLY",           // No chat, no questions
  SHORT_VIDEO: "SHORT_VIDEO",       // Skip / bumper type ads
  FULL_VIDEO: "FULL_VIDEO",         // Non-skip video ads
  LEAD_GENERATION: "LEAD_GENERATION", // Collect user details
  QUESTION_BASED: "QUESTION_BASED"  // Interactive chat with questions
};


function capitalize(text) {
  if (!text) return null;
  return text
    .trim()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function mapAdBehavior(modelTypeName = "") {
  const name = modelTypeName.toLowerCase();

  if (name.includes("question")) {
    return AD_BEHAVIOR.QUESTION_BASED;
  }

  if (name.includes("lead")) {
    return AD_BEHAVIOR.LEAD_GENERATION;
  }

  if (name.includes("non-skip")) {
    return AD_BEHAVIOR.FULL_VIDEO;
  }

  if (name.includes("skip") || name.includes("bumper")) {
    return AD_BEHAVIOR.SHORT_VIDEO;
  }

  return AD_BEHAVIOR.VIEW_ONLY;
}

function campaignTransformer(rawCampaignResponse) {
  const campaign = rawCampaignResponse.data[0];
  const behavior = mapAdBehavior(campaign.modelTypeName);

  return {
    // 🔒 ORIGINAL VALUES (UNCHANGED)
    campaignId: campaign.id,
    campaignName: campaign.campaignName,
    companyId: campaign.companyId,
    companyName: campaign.companyName,
    adModelId: campaign.adModelId,
    adModelName: campaign.modelTypeName,

    // 🧠 INTERNAL BEHAVIOR (ADDED)
    adBehavior: behavior,

    chatRules: {
      enableChat:
        behavior === AD_BEHAVIOR.QUESTION_BASED ||
        behavior === AD_BEHAVIOR.LEAD_GENERATION,

      requiresQuestions: behavior === AD_BEHAVIOR.QUESTION_BASED,

      requiresLeadCapture: behavior === AD_BEHAVIOR.LEAD_GENERATION,

      allowSkip: behavior !== AD_BEHAVIOR.FULL_VIDEO
    },

    // 🎯 TARGETING (RAW → STRUCTURED)
    targeting: {
      gender: campaign.targetGender,
      ageRange: `${campaign.targetLowerAge}-${campaign.targetUpperAge}`,
      areas: campaign.targetArea
        ? campaign.targetArea.split(",").map(a => a.trim())
        : []
    },

    // 🗓️ SCHEDULE
    schedule: {
      startDate: campaign.adStartDate,
      endDate: campaign.adEndDate
    },

    // 🔒 KEEP FLAGS
    firstPageSave: campaign.firstPageSave
  };
}

module.exports = campaignTransformer;
