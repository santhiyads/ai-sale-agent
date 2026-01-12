import "dotenv/config";
import { ingestWebsite } from "../scripts/ingestWebsiteLangChain.js";

const store = await ingestWebsite("https://caketoppersindia.com");

const query = "Do you offer customized cake toppers?";
console.log("\n🔎 QUERY:", query);

const results = await store.similaritySearch(query, 3);

console.log("\n📌 RESULTS:\n");
results.forEach((r, i) => {
  console.log(`--- Result ${i + 1} ---`);
  console.log(r.pageContent.slice(0, 300));
  console.log();
});
