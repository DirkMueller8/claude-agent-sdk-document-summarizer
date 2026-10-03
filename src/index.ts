import "dotenv/config";
import { summarizeDocument } from "./document-summarizer.js";

const filePath = process.argv[2] ?? "./documents/sample-document.md";

async function main() {
  console.log(`Model: ${process.env.ANTHROPIC_MODEL}`);
  console.log(`Summarizing: ${filePath}\n`);

  const result = await summarizeDocument(filePath);

  console.log("Key Points:");
  result.keyPoints.forEach((point, i) => {
    console.log(`  ${i + 1}. ${point}`);
  });
  console.log(`\nSummary:\n  ${result.summary}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
