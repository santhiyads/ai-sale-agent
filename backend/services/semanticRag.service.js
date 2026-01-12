const { ingestWebsite } = require("../scripts/ingestWebsiteLangChain");

// One semantic store per company
const semanticStores = new Map();

/**
 * Initialize semantic RAG for a company
 */
async function initSemanticRag(companyId, websiteUrl) {
  if (!companyId || !websiteUrl) {
    throw new Error("companyId and websiteUrl are required");
  }

  if (!semanticStores.has(companyId)) {
    console.log(`🌐 Initializing Semantic RAG for company ${companyId}`);
    const store = await ingestWebsite(websiteUrl);
    semanticStores.set(companyId, store);
  }
}

/**
 * Retrieve semantic context for a company
 */
async function getSemanticContext(companyId, query, k = 4) {
  const store = semanticStores.get(companyId);

  if (!store) {
    throw new Error(`Semantic RAG not initialized for company ${companyId}`);
  }

  const docs = await store.similaritySearch(query, k);
  return docs.map(d => d.pageContent).join("\n\n");
}

module.exports = {
  initSemanticRag,
  getSemanticContext
};
