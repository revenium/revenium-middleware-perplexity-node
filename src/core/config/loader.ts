/**
 * Configuration Loader Module
 *
 * Handles loading configuration from environment variables.
 * Separated from validation and management for single responsibility.
 */

import { ReveniumConfig } from "../../types/index.js";
import { config as loadDotenv } from "dotenv";

/**
 * Default URLs for consistency with other middleware
 */
const DEFAULT_REVENIUM_BASE_URL = "https://api.revenium.ai";
const DEFAULT_PERPLEXITY_BASE_URL = "https://api.perplexity.ai";

/**
 * Flag to track if .env file has been loaded
 */
let envFileLoaded = false;

/**
 * Load configuration from environment variables
 * Automatically loads .env file from current directory if present
 */
export function loadConfigFromEnv(): ReveniumConfig | null {
  if (!envFileLoaded) {
    loadDotenv();
    envFileLoaded = true;
  }

  const reveniumApiKey =
    process.env.REVENIUM_METERING_API_KEY || process.env.REVENIUM_API_KEY;
  const reveniumBaseUrl =
    process.env.REVENIUM_METERING_BASE_URL ||
    process.env.REVENIUM_BASE_URL ||
    DEFAULT_REVENIUM_BASE_URL;
  const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
  const perplexityBaseUrl =
    process.env.PERPLEXITY_API_BASE_URL || DEFAULT_PERPLEXITY_BASE_URL;
  const debug = process.env.REVENIUM_DEBUG === "true";

  if (!reveniumApiKey) return null;
  if (!perplexityApiKey) return null;

  return {
    reveniumApiKey,
    reveniumBaseUrl,
    perplexityApiKey,
    perplexityBaseUrl,
    debug,
  };
}

