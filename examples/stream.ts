/**
 * Streaming Example with Revenium Perplexity Middleware
 *
 * This example shows how to use streaming with the new API.
 */

import { Initialize, GetClient } from "@revenium/perplexity";

async function main() {
  // Initialize from environment variables
  Initialize();

  // Get client
  const client = GetClient();

  console.log("Streaming response:\n");

  // Create a streaming chat completion
  const stream = await client
    .chat()
    .completions()
    .createStreaming(
      {
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content: "Write a short poem about AI",
          },
        ],
        max_tokens: 200,
      },
      {
        // Optional metadata
        organizationId: "my-customers-name",
        productId: "my-product",
        subscriber: {
          id: "user-123",
          email: "user@example.com",
        },
      }
    );

  // Process stream
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }

  console.log("\n\nUsage data sent to Revenium! Check your dashboard");
}

main().catch(console.error);
