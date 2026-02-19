/**
 * Revenium Perplexity Middleware for TypeScript
 
/**
 * Core types for TypeScript developers using Revenium middleware
 */
export type {
  ReveniumConfig,
  UsageMetadata,
  Logger,
  ProviderInfo,
  Subscriber,
  Credential,
  ReveniumPayload,
  MeteringData,
} from "./types/index.js";

/**
 * Perplexity API types
 */
export type {
  PerplexityChatRequest,
  PerplexityChatResponse,
  PerplexityMessage,
  PerplexityChoice,
  PerplexityUsage,
  PerplexityStreamChunk,
  PerplexityResponse,
  TrackingData,
} from "./types/function-parameters.js";

/**
 * Main API
 */
export {
  Initialize,
  GetClient,
  IsInitialized,
  Reset,
  Configure,
} from "./core/client/index.js";

/**
 * Middleware classes
 */
export {
  ReveniumPerplexity,
  ChatInterface,
  CompletionsInterface,
  StreamingWrapper,
} from "./core/middleware/index.js";

/**
 * Tracking functions (for advanced use cases)
 */
export { trackUsageAsync } from "./core/tracking/index.js";

/**
 * Provider detection functions
 */
export { detectProvider, getProviderMetadata } from "./core/providers/index.js";

/**
 * Tool metering types
 */
export type {
  ToolContext,
  ToolMetadata,
  ToolEventPayload,
  ToolCallReport,
} from "./types/tool-metering.js";

/**
 * Tool metering functions
 */
export {
  meterTool,
  reportToolCall,
} from "./core/tracking/tool-tracker.js";

export {
  setToolContext,
  getToolContext,
  clearToolContext,
  runWithToolContext,
} from "./core/tracking/tool-context.js";
