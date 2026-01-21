/**
 * Usage Tracker Module
 *
 * High-level tracking functions that combine payload building and API communication.
 * Extracted from tracking.ts for better organization.
 */

import {
  UsageMetadata,
  ProviderInfo,
  PerplexityResponse,
  PerplexityChatRequest,
  PerplexityCost,
} from "../../types/index.js";
import { getLogger } from "../config/index.js";
import { sendToRevenium } from "./api-client.js";
import { buildPayload } from "./payload-builder.js";
import { safeAsyncOperation } from "../../utils/error-handler.js";

// Global logger
const logger = getLogger();

/**
 * Chat completions tracking - thin wrapper
 */
export async function sendReveniumMetrics(
  response: PerplexityResponse,
  request: PerplexityChatRequest,
  startTime: number,
  duration: number,
  providerInfo?: ProviderInfo,
  timeToFirstToken?: number,
): Promise<void> {
  await safeAsyncOperation(
    async () => {
      const payload = await buildPayload(
        "CHAT",
        response,
        request,
        startTime,
        duration,
        providerInfo,
        timeToFirstToken,
      );
      await sendToRevenium(payload);
    },
    "Chat completion tracking",
    {
      logError: true,
      rethrow: false, // Don't rethrow to maintain fire-and-forget behavior
      messagePrefix: "Chat completion tracking failed: ",
    },
    logger,
  );
}

/**
 * Fire-and-forget wrapper for chat completions
 * Constructs DTO objects from simple tracking data to call sendReveniumMetrics
 */
export function trackUsageAsync(trackingData: {
  requestId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  duration: number;
  finishReason: string | null;
  usageMetadata?: UsageMetadata;
  isStreamed?: boolean;
  timeToFirstToken?: number;
  providerInfo?: ProviderInfo;
  cost?: PerplexityCost;
  responseFormat?: { type: string; json_schema?: { name: string } } | string;
  messages?: any;
  responseContent?: string;
}): void {
  // Build DTO response object from tracking data
  const dtoResponse: PerplexityResponse = {
    id: trackingData.requestId,
    model: trackingData.model,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    usage: {
      prompt_tokens: trackingData.promptTokens,
      completion_tokens: trackingData.completionTokens,
      total_tokens: trackingData.totalTokens,
      cost: trackingData.cost,
    },
    choices: [
      {
        index: 0,
        finish_reason: trackingData.finishReason,
        ...(trackingData.responseContent && {
          message: {
            role: "assistant",
            content: trackingData.responseContent,
          },
        }),
      },
    ],
  };

  // Build DTO request object from tracking data
  const dtoRequest: PerplexityChatRequest = {
    model: trackingData.model,
    messages: trackingData.messages || [],
    usageMetadata: trackingData.usageMetadata,
    stream: trackingData.isStreamed,
    response_format: trackingData.responseFormat,
  };

  const startTime = Date.now() - trackingData.duration;

  sendReveniumMetrics(
    dtoResponse,
    dtoRequest,
    startTime,
    trackingData.duration,
    trackingData.providerInfo,
    trackingData.timeToFirstToken,
  )
    .then(() => {
      logger.debug("Usage tracking completed successfully", {
        requestId: trackingData.requestId,
        model: trackingData.model,
        totalTokens: trackingData.totalTokens,
        isStreamed: trackingData.isStreamed,
      });
    })
    .catch((error) => {
      logger.warn("Usage tracking failed", {
        error: error instanceof Error ? error.message : String(error),
        requestId: trackingData.requestId,
        model: trackingData.model,
      });
    });
}
