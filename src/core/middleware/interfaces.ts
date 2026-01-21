/**
 * Middleware interfaces for Perplexity API
 */

import type OpenAI from "openai";
import type { UsageMetadata } from "../../types";
import { getLogger } from "../config";
import { generateTransactionId } from "../../utils/transaction-id.js";
import { trackUsageAsync } from "../tracking/index.js";
import { StreamingWrapper } from "./streaming-wrapper.js";
import { sanitizeCredentials } from "../../utils/prompt-extraction.js";

const logger = getLogger();

/**
 * Chat interface - provides access to chat completions
 */
export class ChatInterface {
  constructor(
    private client: OpenAI,
    private config: any,
  ) {}

  /**
   * Get completions interface
   */
  completions(): CompletionsInterface {
    return new CompletionsInterface(this.client, this.config);
  }
}

/**
 * Completions interface - handles chat completion requests
 */
export class CompletionsInterface {
  constructor(
    private client: OpenAI,
    private config: any,
  ) {}

  /**
   * Create a chat completion
   */
  async create(
    params: OpenAI.Chat.ChatCompletionCreateParams,
    metadata?: UsageMetadata,
  ): Promise<any> {
    const startTime = new Date();
    const transactionId = generateTransactionId();

    try {
      logger.debug(
        `[Revenium] Creating chat completion with model: ${params.model}`,
      );

      const response = await this.client.chat.completions.create(params);

      const endTime = Date.now();
      const duration = endTime - startTime.getTime();

      // Track usage asynchronously (fire-and-forget - errors handled internally)
      if ("usage" in response && response.usage) {
        // Extract cost if available (Perplexity-specific)
        const usage = response.usage as any;
        const responseContent =
          "choices" in response
            ? response.choices[0]?.message?.content || undefined
            : undefined;

        trackUsageAsync({
          requestId: ("id" in response ? response.id : null) || transactionId,
          model: params.model,
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
          duration,
          finishReason:
            "choices" in response
              ? response.choices[0]?.finish_reason || null
              : null,
          usageMetadata: metadata,
          isStreamed: false,
          cost: usage.cost,
          responseFormat: params.response_format,
          messages: params.messages,
          responseContent: responseContent
            ? sanitizeCredentials(responseContent)
            : undefined,
        });
      }

      return response;
    } catch (error: any) {
      logger.error(`[Revenium] Error in chat completion: ${error.message}`);

      const endTime = Date.now();
      const duration = endTime - startTime.getTime();

      trackUsageAsync({
        requestId: transactionId,
        model: params.model,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        duration,
        finishReason: "error",
        usageMetadata: metadata,
        isStreamed: false,
        messages: params.messages,
      });

      throw error;
    }
  }

  /**
   * Create a streaming chat completion
   */
  async createStreaming(
    params: OpenAI.Chat.ChatCompletionCreateParams,
    metadata?: UsageMetadata,
  ) {
    const startTime = new Date();
    const transactionId = generateTransactionId();

    try {
      logger.debug(
        `[Revenium] Creating streaming chat completion with model: ${params.model}`,
      );

      const stream = await this.client.chat.completions.create({
        ...params,
        stream: true,
      });

      return new StreamingWrapper(
        stream as any,
        params.model,
        startTime,
        transactionId,
        metadata,
        this.config,
        params.response_format,
        params.messages,
      );
    } catch (error: any) {
      logger.error(
        `[Revenium] Error in streaming chat completion: ${error.message}`,
      );

      const endTime = Date.now();
      const duration = endTime - startTime.getTime();

      trackUsageAsync({
        requestId: transactionId,
        model: params.model,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        duration,
        finishReason: "error",
        usageMetadata: metadata,
        isStreamed: true,
        messages: params.messages,
      });

      throw error;
    }
  }
}
