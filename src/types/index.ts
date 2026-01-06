/**
 * Core Types Module
 *
 * Central type definitions for the Revenium Perplexity middleware.
 * This module exports all core types used throughout the application.
 */

// Re-export function parameter types
export * from "./function-parameters.js";

/**
 * Credential information for subscriber authentication
 */
export interface Credential {
  /** The name/type of the credential */
  name: string;
  /** The credential value */
  value: string;
}

/**
 * Subscriber information for Revenium API
 */
export interface Subscriber {
  /** Unique identifier for the subscriber/user */
  id?: string;
  /** Email address of the subscriber */
  email?: string;
  /** Optional authentication credential for the subscriber */
  credential?: Credential;
}

/**
 * Usage metadata interface for tracking additional context
 */
export interface UsageMetadata {
  /** User identification information */
  subscriber?: Subscriber;

  /** Organization or company identifier */
  organizationId?: string;
  /** Product or application identifier */
  productId?: string;
  /** Subscription identifier */
  subscriptionId?: string;

  /** Task type classification */
  taskType?: string;
  /** Distributed tracing identifier */
  traceId?: string;

  /** Quality score for response evaluation (0.0-1.0 scale) */
  responseQualityScore?: number;

  /** Agent or model variant identifier */
  agent?: string;
}

/**
 * Provider information for tracking API source
 */
export interface ProviderInfo {
  /** The detected AI provider type */
  provider: string;
  /** Model source identifier */
  modelSource: string;
}

/**
 * Logger interface
 */
export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

/**
 * Revenium configuration interface
 */
export interface ReveniumConfig {
  /** Revenium API key */
  reveniumApiKey: string;
  /** Revenium base URL */
  reveniumBaseUrl: string;
  /** Perplexity API key */
  perplexityApiKey?: string;
  /** Perplexity base URL */
  perplexityBaseUrl?: string;
  /** Debug mode flag */
  debug?: boolean;
  /** Custom logger */
  logger?: Logger;
  /** Print usage summary to console (default: false). Can be true, false, 'human', or 'json' */
  printSummary?: boolean | "human" | "json";
  /** Team ID for cost retrieval from Revenium API */
  teamId?: string;
}

/**
 * Configuration interface (alias for backward compatibility)
 */
export interface Config extends ReveniumConfig {}

/**
 * Revenium API payload structure
 */
export interface ReveniumPayload {
  // Core fields
  costType: "AI";
  model: string;
  responseTime: string;
  requestDuration: number;
  provider: string;
  modelSource: string;
  requestTime: string;
  completionStartTime: string;

  // Token counts
  inputTokenCount: number;
  outputTokenCount: number;
  totalTokenCount: number;
  reasoningTokenCount?: number;
  cacheCreationTokenCount?: number;
  cacheReadTokenCount?: number;

  // Metadata
  organizationId?: string;
  subscriptionId?: string;
  productId?: string;
  subscriber?: Subscriber;
  transactionId: string;
  traceId?: string;
  taskType?: string;
  operationType: "CHAT" | "EMBED";
  stopReason: string;
  isStreamed: boolean;
  timeToFirstToken?: number;
  agent?: string;
  responseQualityScore?: number;

  // Trace visualization fields
  environment?: string;
  region?: string;
  credentialAlias?: string;
  traceType?: string;
  traceName?: string;
  parentTransactionId?: string;
  transactionName?: string;
  retryNumber?: number;
  operationSubtype?: string;

  // Middleware info
  middlewareSource: string;

  // Costs
  inputTokenCost?: number;
  outputTokenCost?: number;
  totalCost?: number;
}

/**
 * Metering data interface (legacy, for backward compatibility)
 */
export interface MeteringData extends ReveniumPayload {}
