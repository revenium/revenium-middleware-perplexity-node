/**
 * Payload Builder Module
 *
 * Handles construction of Revenium API payloads.
 * Extracted from tracking.ts for single responsibility.
 */

import { randomUUID } from "crypto";
import {
  ReveniumPayload,
  PerplexityResponse,
  PerplexityChatRequest,
  ProviderInfo,
} from "../../types/index.js";
import { getLogger } from "../config/index.js";
import { mapStopReason } from "../../utils/stop-reason-mapper.js";
import { buildMetadataFields } from "../../utils/metadata-builder.js";
import { getProviderMetadata } from "../providers/index.js";

// Global logger
const logger = getLogger();

/**
 * Build payload for Revenium API
 *
 * This shared payload builder eliminates payload duplication.
 * Handles CHAT operation type for Perplexity.
 *
 * @param operationType - Type of operation (CHAT)
 * @param response - API response from Perplexity
 * @param request - Original request parameters
 * @param startTime - Request start timestamp
 * @param duration - Request duration in milliseconds
 * @param providerInfo - Provider information (always Perplexity)
 * @param timeToFirstToken - Time to first token in milliseconds (for streaming)
 * @returns Constructed payload for Revenium API
 */
export function buildPayload(
  operationType: "CHAT",
  response: PerplexityResponse,
  request: PerplexityChatRequest,
  startTime: number,
  duration: number,
  providerInfo?: ProviderInfo,
  timeToFirstToken?: number
): ReveniumPayload {
  const now = new Date().toISOString();
  const requestTime = new Date(startTime).toISOString();
  const usage = response.usage;

  if (!usage) {
    throw new Error("Response usage data is missing");
  }

  const modelName = response.model;

  // Get provider metadata (always Perplexity)
  const providerMetadata = providerInfo
    ? getProviderMetadata()
    : { provider: "Perplexity", modelSource: "PERPLEXITY" };

  // Build metadata fields using utility (eliminates repetitive spreading)
  const metadataFields = buildMetadataFields(request.usageMetadata);

  // Map Perplexity cost object to Revenium cost fields
  const costFields = usage.cost
    ? {
        inputTokenCost: usage.cost.input_tokens_cost,
        outputTokenCost: usage.cost.output_tokens_cost,
        totalCost: usage.cost.total_cost,
      }
    : {
        // Let Revenium calculate costs if not provided
        inputTokenCost: undefined,
        outputTokenCost: undefined,
        totalCost: undefined,
      };

  // Common fields for all operations
  const commonPayload = {
    costType: "AI" as const,
    model: modelName,
    responseTime: now,
    requestDuration: duration,
    provider: providerMetadata.provider,
    modelSource: providerMetadata.modelSource,
    requestTime,
    completionStartTime: now,

    // Common token counts
    inputTokenCount: usage.prompt_tokens,
    totalTokenCount: usage.total_tokens,

    // Metadata fields (processed by utility)
    ...metadataFields,

    // Fixed middleware source identifier (spec format: revenium-{provider}-{language})
    middlewareSource: "revenium-perplexity-node",

    // Cost fields from Perplexity
    ...costFields,
  };

  // Chat-specific fields
  return {
    ...commonPayload,
    operationType: "CHAT",
    transactionId: response.id || `chat-${randomUUID()}`,
    outputTokenCount: usage.completion_tokens || 0,
    // Perplexity doesn't support reasoning or caching
    reasoningTokenCount: undefined,
    cacheCreationTokenCount: undefined,
    cacheReadTokenCount: undefined,
    stopReason: mapStopReason(
      response.choices?.[0]?.finish_reason,
      logger
    ),
    isStreamed: Boolean(request.stream),
    // Time to first token (for streaming requests)
    timeToFirstToken: timeToFirstToken,
  };
}

