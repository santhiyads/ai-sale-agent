import "dotenv/config";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

export async function ingestWebsite(url) {
  console.log("🚀 STARTING LANGCHAIN INGEST");
  console.log("🌐 Website:", url);

  const loader = new CheerioWebBaseLoader(url, {
    selector: "body",
  });

  const docs = await loader.load();
  console.log("📄 Pages loaded:", docs.length);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);
  console.log("🧩 Chunks created:", splitDocs.length);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings({ model: "text-embedding-3-small" })
  );

  console.log("✅ INGEST COMPLETE");
  return vectorStore;
}
