/**
 * Metadata Example
 * Demonstrates advanced metadata usage with Revenium Perplexity middleware.
 */

import { Initialize, GetClient, UsageMetadata } from "@revenium/perplexity";

async function main() {
  // Initialize middleware
  Initialize();

  // Get client
  const client = GetClient();

  // Optional metadata for advanced reporting, lineage tracking, and cost allocation
  const metadata: UsageMetadata = {
    // Organization & billing
    organizationName: "org-metadata-demo",
    subscriptionId: "plan-premium-2025",

    // Product & task tracking
    productName: "ai-assistant",
    taskType: "explanation-request",
    agent: "perplexity-metadata-chat-node",

    // Session tracking
    traceId: "session-" + Date.now(),

    // Quality metrics
    responseQualityScore: 0.95, // 0.0-1.0 scale

    // User tracking
    subscriber: {
      id: "user-12345",
      email: "developer@company.com",
      credential: {
        name: "api-key-prod",
        value: "key-abc-123",
      },
    },
  };

  const response = await client
    .chat()
    .completions()
    .create(
      {
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content:
              "Say hello in Spanish and explain why Spanish is a beautiful language in 2-3 sentences.",
          },
        ],
        max_tokens: 1000,
      },
      metadata,
    );

  // Display response
  if (response.choices.length > 0) {
    console.log(`Assistant: ${response.choices[0].message.content}`);
  }
  console.log("\nUsage data sent to Revenium! Check your dashboard");
}

main().catch(console.error);
