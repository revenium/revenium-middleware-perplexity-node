/**
 * Advanced Example
 * Demonstrates advanced features like system prompts, conversation history,
 * and different model parameters with Revenium Perplexity middleware.
 */

import { Initialize, GetClient, UsageMetadata } from "@revenium/perplexity";

async function main() {
  // Initialize middleware
  Initialize();

  // Get client
  const client = GetClient();

  // Metadata for tracking
  const metadata: UsageMetadata = {
    organizationId: "org-advanced-demo",
    productId: "prod-perplexity-advanced",
    taskType: "multi-turn-conversation",
    subscriber: {
      id: "user-advanced-001",
      email: "advanced@example.com",
    },
  };

  console.log("=== Advanced Perplexity Example ===\n");

  // Example 1: Using system prompt and conversation history
  console.log("1. Multi-turn conversation with system prompt:\n");

  const response1 = await client
    .chat()
    .completions()
    .create(
      {
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant that provides concise, accurate answers.",
          },
          {
            role: "user",
            content: "What is the capital of France?",
          },
          {
            role: "assistant",
            content: "The capital of France is Paris.",
          },
          {
            role: "user",
            content: "What is its population?",
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      metadata
    );

  console.log(`Assistant: ${response1.choices[0].message.content}\n`);
  console.log(`Tokens used: ${response1.usage?.total_tokens}\n`);

  // Example 2: Using different temperature for creative responses
  console.log("2. Creative response with higher temperature:\n");

  const response2 = await client
    .chat()
    .completions()
    .create(
      {
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content:
              "Write a creative tagline for an AI company in 10 words or less.",
          },
        ],
        max_tokens: 100,
        temperature: 1.0, // Higher temperature for more creativity
      },
      {
        ...metadata,
        taskType: "creative-generation",
      }
    );

  console.log(`Assistant: ${response2.choices[0].message.content}\n`);

  // Example 3: Using sonar-reasoning for complex reasoning tasks
  console.log("3. Complex reasoning with sonar-reasoning model:\n");

  const response3 = await client
    .chat()
    .completions()
    .create(
      {
        model: "sonar-reasoning",
        messages: [
          {
            role: "user",
            content:
              "If a train travels 120 km in 2 hours, and then 180 km in 3 hours, what is its average speed for the entire journey?",
          },
        ],
        max_tokens: 500,
      },
      {
        ...metadata,
        taskType: "reasoning",
      }
    );

  console.log(`Assistant: ${response3.choices[0].message.content}\n`);
  console.log(`Tokens used: ${response3.usage?.total_tokens}\n`);

  console.log("\nAll usage data sent to Revenium! Check your dashboard");
}

main().catch(console.error);
