/**
 * Function Parameter Types
 *
 * Comprehensive type definitions for function parameters throughout the middleware.
 * These interfaces provide type safety by replacing 'any' types with proper,
 * well-documented interfaces that match Perplexity API structures and internal requirements.
 *
 * @fileoverview Type-safe function parameter definitions
 * @author Revenium
 * @since 2.0.0
 */

import { UsageMetadata } from "./index.js";

/**
 * Perplexity API response structure for chat completions
 *
 * Represents the complete response structure returned by Perplexity's chat completions API.
 * Includes usage statistics, response choices, and metadata. Used internally for
 * processing responses and extracting usage metrics.
 *
 * @public
 */
export interface PerplexityChatResponse {
  /** Unique identifier for the chat completion */
  id: string;
  /** Model used for the completion */
  model: string;
  /** Token usage statistics */
  usage: {
    /** Number of tokens in the prompt */
    prompt_tokens: number;
    /** Number of tokens in the completion */
    completion_tokens: number;
    /** Total tokens used (prompt + completion) */
    total_tokens: number;
  };
  /** Array of completion choices */
  choices: Array<{
    /** Reason why the completion finished */
    finish_reason: string | null;
    /** Complete message (for non-streaming responses) */
    message?: {
      /** Message content */
      content: string;
      /** Message role (assistant, user, system) */
      role: string;
    };
    /** Delta message (for streaming responses) */
    delta?: {
      /** Incremental content */
      content?: string;
      /** Message role */
      role?: string;
    };
  }>;
  /** Unix timestamp of when the completion was created */
  created?: number;
  /** Object type identifier */
  object?: string;
}

/**
 * Perplexity API request structure for chat completions
 *
 * Represents the request parameters sent to Perplexity's chat completions API.
 * Includes model selection, messages, and optional parameters.
 *
 * @public
 */
export interface PerplexityChatRequest {
  /** Model to use for the completion */
  model: string;
  /** Array of messages in the conversation */
  messages: Array<{
    /** Message role */
    role: "system" | "user" | "assistant";
    /** Message content */
    content: string;
  }>;
  /** Maximum number of tokens to generate */
  max_tokens?: number;
  /** Temperature for sampling */
  temperature?: number;
  /** Top-p for nucleus sampling */
  top_p?: number;
  /** Whether to stream the response */
  stream?: boolean;
  /** Presence penalty */
  presence_penalty?: number;
  /** Frequency penalty */
  frequency_penalty?: number;
  /** Usage metadata for Revenium tracking (custom field, not sent to Perplexity) */
  usageMetadata?: UsageMetadata;
}

/**
 * Perplexity message structure
 */
export interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Perplexity cost breakdown (specific to Perplexity API)
 */
export interface PerplexityCost {
  input_tokens_cost: number;
  output_tokens_cost: number;
  request_cost: number;
  total_cost: number;
}

/**
 * Perplexity usage statistics
 */
export interface PerplexityUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  search_context_size?: string; // "low" | "medium" | "high"
  cost?: PerplexityCost;
}

/**
 * Perplexity choice structure
 */
export interface PerplexityChoice {
  index: number;
  message?: {
    role: string;
    content: string;
  };
  delta?: {
    role?: string;
    content?: string;
  };
  finish_reason: string | null;
}

/**
 * Perplexity response structure
 */
export interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: PerplexityChoice[];
  usage?: PerplexityUsage;
}

/**
 * Perplexity stream chunk structure
 */
export interface PerplexityStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: PerplexityChoice[];
}

/**
 * Tracking data structure for usage tracking
 *
 * Contains all necessary information for tracking API usage with Revenium.
 * Used internally by the tracking system.
 *
 * @internal
 */
export interface TrackingData {
  /** Unique request identifier */
  requestId: string;
  /** Model used for the request */
  model: string;
  /** Number of prompt tokens */
  promptTokens: number;
  /** Number of completion tokens */
  completionTokens: number;
  /** Total number of tokens */
  totalTokens: number;
  /** Request duration in milliseconds */
  duration: number;
  /** Finish reason from the API */
  finishReason: string | null;
  /** Usage metadata */
  usageMetadata?: UsageMetadata;
  /** Whether the request was streamed */
  isStreamed?: boolean;
  /** Time to first token (for streaming) */
  timeToFirstToken?: number;
}
