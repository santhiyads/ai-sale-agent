/**
 * Semantic RAG Service (PRODUCTION – Pinecone)
 */

require("dotenv").config();

const fs = require("fs-extra");
const path = require("path");

const { CheerioWebBaseLoader } =
  require("@langchain/community/document_loaders/web/cheerio");

const { RecursiveCharacterTextSplitter } =
  require("@langchain/textsplitters");

const { OpenAIEmbeddings } =
  require("@langchain/openai");

const { Pinecone } =
  require("@pinecone-database/pinecone");

const { PineconeStore } =
  require("@langchain/pinecone");

const { Document } =
  require("@langchain/core/documents");

const EMBEDDED_JSON = path.join(process.cwd(), "embedded.json");



/* --------------------------------------------------
   Embeddings (MODEL IS CORRECTLY HERE ✅)
-------------------------------------------------- */
const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-small"
});



/* --------------------------------------------------
   Pinecone Client (MISSING BEFORE — FIXED ✅)
-------------------------------------------------- */
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});



/* --------------------------------------------------
   Vector Store Helper
-------------------------------------------------- */
async function getVectorStore() {
  const index = pinecone.index(process.env.PINECONE_INDEX);

  return await PineconeStore.fromExistingIndex(
    embeddings,
    { pineconeIndex: index }
  );
}



/* --------------------------------------------------
   Embedded URL tracking
-------------------------------------------------- */
async function markEmbedded(url) {
  let map = {};
  try {
    map = await fs.readJson(EMBEDDED_JSON);
  } catch {}

  map[url] = { embeddedAt: new Date().toISOString() };
  await fs.writeJson(EMBEDDED_JSON, map, { spaces: 2 });
}

async function isUrlEmbedded(url) {
  try {
    const map = await fs.readJson(EMBEDDED_JSON);
    return Boolean(map[url]);
  } catch {
    return false;
  }
}



/* --------------------------------------------------
   OPTIONAL: Crawl index
-------------------------------------------------- */
async function buildIndex(startUrl, maxPages = 30) {
  const visited = new Set();
  const queue = [startUrl];
  const origin = new URL(startUrl).origin;
  const index = [];

  while (queue.length && index.length < maxPages) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const loader = new CheerioWebBaseLoader(url);
      const docs = await loader.load();

      index.push({ url });

      const cheerio = require("cheerio");
      const $ = cheerio.load(docs[0].pageContent);

      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;
        const full = new URL(href, url).toString();
        if (full.startsWith(origin) && !visited.has(full)) {
          queue.push(full);
        }
      });
    } catch {}
  }

  return index;
}



/* --------------------------------------------------
   Fetch + Embed
-------------------------------------------------- */
async function fetchAndEmbed(url) {
  console.log("🌐 Semantic ingest:", url);

  const loader = new CheerioWebBaseLoader(url, {
    selector: "article,main,.rte,.content,body",
    timeout: 20000
  });

  const docs = await loader.load();
  if (!docs.length) throw new Error("No content extracted");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150
  });

  const preparedDocs = docs.map(d =>
    new Document({
      pageContent: d.pageContent,
      metadata: { source: url }
    })
  );

  const chunks = await splitter.splitDocuments(preparedDocs);

  const store = await getVectorStore();
  await store.addDocuments(chunks);

  await markEmbedded(url);

  console.log(`✅ Embedded ${chunks.length} chunks`);
}



/* --------------------------------------------------
   Retrieve Semantic Context
-------------------------------------------------- */
async function fetchIfNeededAndAnswer(url, question) {
  if (!(await isUrlEmbedded(url))) {
    await fetchAndEmbed(url);
  }

  const store = await getVectorStore();

  const retriever = store.asRetriever({ k: 5 });

  const results = await retriever.invoke(question);

  return {
    context: results.map(d => d.pageContent).join("\n\n"),
    sources: results.map(d => d.metadata?.source)
  };
}



/* --------------------------------------------------
   EXPORTS
-------------------------------------------------- */
module.exports = {
  buildIndex,
  fetchAndEmbed,
  isUrlEmbedded,
  fetchIfNeededAndAnswer
};
