/**
 * Streaming wrapper for Perplexity API
 */

import type { UsageMetadata } from "../../types";
import { getLogger } from "../config";
import { trackUsageAsync } from "../tracking";

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

  constructor(
    stream: AsyncIterable<any>,
    model: string,
    startTime: Date,
    transactionId: string,
    metadata?: UsageMetadata,
    config?: any
  ) {
    this.stream = stream;
    this.model = model;
    this.startTime = startTime;
    this.transactionId = transactionId;
    this.metadata = metadata;
    this.config = config || {};
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

    try {
      for await (const chunk of this.stream) {
        // Capture time of first chunk
        if (!firstChunkTime) {
          firstChunkTime = new Date();
          timeToFirstToken =
            firstChunkTime.getTime() - this.startTime.getTime();
        }

        lastChunk = chunk;

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
      });
    } catch (error: any) {
      // Log error
      logger.error("[Revenium] Error in stream processing:", error.message);
      throw error;
    }
  }
}
