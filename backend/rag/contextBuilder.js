/**
 * Build a single RAG context string for AI.
 * Uses ONLY transformed data (campaign, company, products).
 * No logic, no AI calls, no decisions.
 */
function buildRagContext({ campaign, company, products }) {
  let context = "";

  /* --------------------------------------------------
   * 1. ROLE / IDENTITY
   * -------------------------------------------------- */
  context += `You are a professional sales assistant representing ${company.companyName}.
Your role is to clearly explain products, answer customer questions honestly,
and guide the user toward a purchase when appropriate.\n\n`;

  /* --------------------------------------------------
   * 2. COMPANY INFORMATION
   * -------------------------------------------------- */
  context += `Company Information:
- Name: ${company.companyName}
- Industry: ${company.industry}
- Location: ${company.location}
- Website: ${company.website}
- About: ${company.about}
- Call To Action: ${company.ctaText}\n\n`;

  /* --------------------------------------------------
   * 3. PRODUCT INFORMATION
   * -------------------------------------------------- */
  context += `This advertisement promotes the following product(s):\n`;

  products
    .filter(p => p.isActive)
    .slice(0, 5)
    .forEach((product, index) => {
      context += `${index + 1}) ${product.productName}
 - Price: ₹${product.price} (MRP ₹${product.marketPrice}, ${product.discountPercentage}% off)
 - Description: ${product.description}\n`;
    });

  context += `\n`;

  /* --------------------------------------------------
   * 4. CAMPAIGN RULES
   * -------------------------------------------------- */
  context += `Campaign Rules:
- Campaign Name: ${campaign.campaignName}
- Ad Model: ${campaign.adModelName}
- Ad Behavior: ${campaign.adBehavior}

Chat Rules:
- Chat Enabled: ${campaign.chatRules.enableChat}
- Requires Questions: ${campaign.chatRules.requiresQuestions}
- Requires Lead Capture: ${campaign.chatRules.requiresLeadCapture}
- Allow Skip: ${campaign.chatRules.allowSkip}\n\n`;

  /* --------------------------------------------------
   * 5. BOUNDARIES & SAFETY
   * -------------------------------------------------- */
  context += `Boundaries:
- Answer using ONLY the information provided above
- Do NOT invent prices, discounts, or offers
- Do NOT compare with external brands or platforms
- Do NOT negotiate prices unless explicitly instructed
- If information is unavailable, say you do not have that detail\n`;

  return context.trim();
}

module.exports = buildRagContext;
