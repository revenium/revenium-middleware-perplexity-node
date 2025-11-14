/**
 * Provider Detection Module
 *
 * Handles provider metadata for Perplexity AI.
 */

import { ProviderInfo } from "../../types/index.js";
import { getLogger } from "../config/index.js";

// Global logger
const logger = getLogger();

/**
 * Get provider info for Perplexity
 *
 * @returns ProviderInfo with Perplexity provider
 */
export function detectProvider(): ProviderInfo {
  logger.debug("Using Perplexity AI provider");
  return {
    provider: "PERPLEXITY",
    modelSource: "PERPLEXITY",
  };
}

/**
 * Get provider metadata for Revenium payload
 *
 * @returns metadata object for Revenium
 */
export function getProviderMetadata(): {
  provider: string;
  modelSource: string;
} {
  return {
    provider: "Perplexity",
    modelSource: "PERPLEXITY",
  };
}
