const axios = require("axios");

/**
 * Controlled web search using DuckDuckGo
 * Returns factual text only (no links, no ads)
 */
async function webSearch(query) {
  try {
    const response = await axios.get(
      "https://api.duckduckgo.com/",
      {
        params: {
          q: query,
          format: "json",
          no_redirect: 1,
          no_html: 1,
          skip_disambig: 1
        }
      }
    );

    // 1️⃣ Best case: short abstract
    if (response.data?.AbstractText) {
      return response.data.AbstractText;
    }

    // 2️⃣ Fallback: related topic snippets
    if (Array.isArray(response.data?.RelatedTopics)) {
      const snippets = response.data.RelatedTopics
        .flatMap(t => {
          if (t.Text) return [t.Text];
          if (Array.isArray(t.Topics)) {
            return t.Topics.map(x => x.Text).filter(Boolean);
          }
          return [];
        })
        .filter(Boolean)
        .slice(0, 5);

      return snippets.join("\n");
    }

    return "";
  } catch (err) {
    console.error("Web search failed:", err.message);
    return "";
  }
}

module.exports = {
  webSearch
};
