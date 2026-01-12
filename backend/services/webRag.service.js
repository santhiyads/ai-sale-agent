const { webSearch } = require("./webSearch.service");

/**
 * Retrieve external factual context
 */
async function getWebContext(userMessage) {
  const summary = await webSearch(userMessage);

  return summary
    ? `External factual information:\n${summary}`
    : "";
}

module.exports = {
  getWebContext
};
