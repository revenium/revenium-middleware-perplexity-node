import { Configure, GetClient, UsageMetadata } from "../src/index.js";

async function main() {
  console.log("=== Perplexity Prompt Capture Example ===\n");

  Configure({
    reveniumApiKey: process.env.REVENIUM_METERING_API_KEY || "test-key",
    reveniumBaseUrl: process.env.REVENIUM_METERING_BASE_URL,
    perplexityApiKey: process.env.PERPLEXITY_API_KEY || "test-key",
    capturePrompts: true,
  });

  const client = GetClient();

  console.log("Example 1: Prompt capture enabled via config");
  console.log("Making request with prompt capture enabled...\n");

  try {
    const metadata: UsageMetadata = {
      organizationName: "org-prompt-capture-demo",
      productName: "prod-perplexity-prompt-capture",
    };

    const response = await client
      .chat()
      .completions()
      .create(
        {
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that provides concise answers.",
            },
            {
              role: "user",
              content: "What is the capital of France?",
            },
          ],
          max_tokens: 100,
        },
        metadata,
      );

    console.log("Response:", response.choices[0]?.message?.content);
    console.log("\nPrompts captured and sent to Revenium API!");
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error),
    );
  }

  console.log("\n" + "=".repeat(50) + "\n");
  console.log("Example 2: Prompt capture disabled via metadata override");
  console.log("Making request with prompt capture disabled...\n");

  try {
    const metadata2: UsageMetadata = {
      organizationName: "org-prompt-capture-demo",
      productName: "prod-perplexity-prompt-capture",
      capturePrompts: false,
    };

    const response2 = await client
      .chat()
      .completions()
      .create(
        {
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
            {
              role: "user",
              content: "What is 2+2?",
            },
          ],
          max_tokens: 100,
        },
        metadata2,
      );

    console.log("Response:", response2.choices[0]?.message?.content);
    console.log("\nPrompts NOT captured (overridden via metadata)!");
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error),
    );
  }

  console.log("\n" + "=".repeat(50) + "\n");
  console.log("Example 3: Prompt capture with environment variable");
  console.log("Set REVENIUM_CAPTURE_PROMPTS=true in your .env file\n");

  console.log("✅ Prompt capture examples completed!");
  console.log("\nConfiguration hierarchy:");
  console.log("1. Per-call metadata (highest priority)");
  console.log("2. Global config");
  console.log("3. Environment variable REVENIUM_CAPTURE_PROMPTS");
  console.log("4. Default: false (lowest priority)");
}

main().catch(console.error);
