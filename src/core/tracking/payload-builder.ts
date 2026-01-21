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
import {
  getEnvironment,
  getRegion,
  getCredentialAlias,
  getTraceType,
  getTraceName,
  getParentTransactionId,
  getTransactionName,
  getRetryNumber,
  detectOperationSubtype,
} from "../../utils/trace-fields.js";
import { extractPrompts } from "../../utils/prompt-extraction.js";

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
export async function buildPayload(
  operationType: "CHAT",
  response: PerplexityResponse,
  request: PerplexityChatRequest,
  startTime: number,
  duration: number,
  providerInfo?: ProviderInfo,
  timeToFirstToken?: number,
): Promise<ReveniumPayload> {
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

  const environment = getEnvironment();
  const region = await getRegion();
  const credentialAlias = getCredentialAlias();
  const traceType = getTraceType();
  const traceName = getTraceName();
  const parentTransactionId = getParentTransactionId();
  const transactionName = getTransactionName();
  const retryNumber = getRetryNumber();
  const operationSubtype = detectOperationSubtype(request);

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

    environment: environment || undefined,
    region: region || undefined,
    credentialAlias: credentialAlias || undefined,
    traceType: traceType || undefined,
    traceName: traceName || undefined,
    parentTransactionId: parentTransactionId || undefined,
    transactionName: transactionName || undefined,
    retryNumber: retryNumber !== null ? retryNumber : undefined,
    operationSubtype: operationSubtype || undefined,

    // Fixed middleware source identifier (spec format: revenium-{provider}-{language})
    middlewareSource: "revenium-perplexity-node",

    // Cost fields from Perplexity
    ...costFields,
  };

  // Chat-specific fields
  const promptData = extractPrompts(request, response, request.usageMetadata);

  return {
    ...commonPayload,
    operationType: "CHAT",
    transactionId: response.id || `chat-${randomUUID()}`,
    outputTokenCount: usage.completion_tokens || 0,
    // Perplexity doesn't support reasoning or caching
    reasoningTokenCount: undefined,
    cacheCreationTokenCount: undefined,
    cacheReadTokenCount: undefined,
    stopReason: mapStopReason(response.choices?.[0]?.finish_reason, logger),
    isStreamed: Boolean(request.stream),
    // Time to first token (for streaming requests)
    timeToFirstToken: timeToFirstToken,
    ...(promptData && {
      systemPrompt: promptData.systemPrompt,
      inputMessages: promptData.inputMessages,
      outputResponse: promptData.outputResponse,
      promptsTruncated: promptData.promptsTruncated,
    }),
  };
}
