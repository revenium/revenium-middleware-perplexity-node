/**
 * Streaming wrapper for Perplexity API
 */

import type { UsageMetadata } from "../../types";
import { getLogger } from "../config";
import { trackUsageAsync } from "../tracking";
import {
  shouldCapturePrompts,
  getMaxPromptSize,
  sanitizeCredentials,
} from "../../utils/prompt-extraction.js";

const logger = getLogger();

/**
 * Wrapper for streaming responses that tracks usage
 */
export class StreamingWrapper {
  private stream: AsyncIterable<any>;
  private model: string;
  private startTime: Date;
  private transactionId: string;
  private metadata?: UsageMetadata;
  private config: any;
  private responseFormat?:
    | { type: string; json_schema?: { name: string } }
    | string;
  private messages: any;
  private accumulatedContent: string = "";

  constructor(
    stream: AsyncIterable<any>,
    model: string,
    startTime: Date,
    transactionId: string,
    metadata?: UsageMetadata,
    config?: any,
    responseFormat?: { type: string; json_schema?: { name: string } } | string,
    messages?: any
  ) {
    this.stream = stream;
    this.model = model;
    this.startTime = startTime;
    this.transactionId = transactionId;
    this.metadata = metadata;
    this.config = config || {};
    this.responseFormat = responseFormat;
    this.messages = messages || [];
  }

  /**
   * Iterate over stream chunks
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<any> {
    let lastChunk: any = null;
    let inputTokens = 0;
    let outputTokens = 0;
    let totalTokens = 0;
    let costData: any = undefined;
    let firstChunkTime: Date | null = null;
    let timeToFirstToken = 0;
    let completed = false;

    try {
      for await (const chunk of this.stream) {
        // Capture time of first chunk
        if (!firstChunkTime) {
          firstChunkTime = new Date();
          timeToFirstToken =
            firstChunkTime.getTime() - this.startTime.getTime();
        }

        lastChunk = chunk;

        if (
          chunk.choices?.[0]?.delta?.content &&
          shouldCapturePrompts(this.metadata)
        ) {
          const maxSize = getMaxPromptSize();
          const remaining = maxSize - this.accumulatedContent.length;
          if (remaining > 0) {
            this.accumulatedContent += chunk.choices[0].delta.content.slice(
              0,
              remaining
            );
          }
        }

        // Track usage if available in chunk
        if (chunk.usage) {
          inputTokens = chunk.usage.prompt_tokens || 0;
          outputTokens = chunk.usage.completion_tokens || 0;
          totalTokens = chunk.usage.total_tokens || 0;
          // Extract cost data if available (Perplexity-specific)
          if (chunk.usage.cost) {
            costData = chunk.usage.cost;
          }
        }

        yield chunk;
      }

      completed = true;

      // Send metering data when stream completes (fire-and-forget)
      const endTime = Date.now();
      const duration = endTime - this.startTime.getTime();

      // fire-and-forget
      trackUsageAsync({
        requestId: this.transactionId,
        model: this.model,
        promptTokens: inputTokens,
        completionTokens: outputTokens,
        totalTokens,
        duration,
        finishReason: lastChunk?.choices?.[0]?.finish_reason || null,
        usageMetadata: this.metadata,
        isStreamed: true,
        timeToFirstToken,
        cost: costData,
        responseFormat: this.responseFormat,
        messages: this.messages,
        responseContent: this.accumulatedContent
          ? sanitizeCredentials(this.accumulatedContent)
          : undefined,
      });
    } catch (error: any) {
      completed = true;

      logger.error("[Revenium] Error in stream processing:", error.message);

      const endTime = Date.now();
      const duration = endTime - this.startTime.getTime();

      trackUsageAsync({
        requestId: this.transactionId,
        model: this.model,
        promptTokens: inputTokens,
        completionTokens: outputTokens,
        totalTokens,
        duration,
        finishReason: "error",
        usageMetadata: this.metadata,
        isStreamed: true,
        messages: this.messages,
        responseContent: this.accumulatedContent
          ? sanitizeCredentials(this.accumulatedContent)
          : undefined,
      });

      throw error;
    } finally {
      if (!completed) {
        const endTime = Date.now();
        const duration = endTime - this.startTime.getTime();

        trackUsageAsync({
          requestId: this.transactionId,
          model: this.model,
          promptTokens: inputTokens,
          completionTokens: outputTokens,
          totalTokens,
          duration,
          finishReason: "cancelled",
          usageMetadata: this.metadata,
          isStreamed: true,
          timeToFirstToken,
          cost: costData,
          responseFormat: this.responseFormat,
          messages: this.messages,
          responseContent: this.accumulatedContent
            ? sanitizeCredentials(this.accumulatedContent)
            : undefined,
        });

        logger.debug("[Revenium] Streaming cancelled", {
          requestId: this.transactionId,
          model: this.model,
          duration,
        });
      }
    }
  }
}
