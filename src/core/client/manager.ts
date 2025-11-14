/**
 * Client Manager - singleton pattern
 *
 * Provides Initialize/GetClient pattern.
 * Manages singleton instance of ReveniumPerplexity client.
 *
 */

import { ReveniumPerplexity } from "../middleware/revenium-client.js";
import type { ReveniumConfig } from "../../types/index.js";
import { initializeConfig, getLogger } from "../config/manager.js";

/**
 * Singleton instance of ReveniumPerplexity client
 */
let clientInstance: ReveniumPerplexity | null = null;
const logger = getLogger();


/**
 * Initialize Revenium Perplexity client from environment variables
 *
 * Loads configuration from environment:
 * - REVENIUM_METERING_API_KEY (required)
 * - PERPLEXITY_API_KEY (required)
 * @throws {Error} If required environment variables are missing
 */
export function Initialize(): void {
  logger.debug("Initializing Revenium Perplexity client");

  const config = initializeConfig();
  Configure(config);

  logger.debug("Revenium Perplexity client initialized successfully");
}

/**
 * Configure Revenium Perplexity client with custom configuration
 *
 * @param config - Configuration object
 * @throws {Error} If required configuration fields are missing
 *
 */
export function Configure(config: ReveniumConfig): void {
  logger.debug("Configuring Revenium Perplexity client");
  if (!config.reveniumApiKey) {
    throw new Error("reveniumApiKey is required in configuration");
  }

  if (!config.perplexityApiKey) {
    throw new Error("perplexityApiKey is required in configuration");
  }

  const fullConfig: ReveniumConfig = {
    ...config,
    reveniumBaseUrl: config.reveniumBaseUrl || "https://api.revenium.ai",
    perplexityBaseUrl: config.perplexityBaseUrl || "https://api.perplexity.ai",
    debug: config.debug ?? false,
  };

  clientInstance = new ReveniumPerplexity(fullConfig);

  if (fullConfig.debug) {
    logger.debug("Revenium Perplexity client initialized successfully");
  }
}

/**
 * Get the singleton ReveniumPerplexity client instance
 *
 * @returns {ReveniumPerplexity} The client instance
 * @throws {Error} If client has not been initialized
 *
 */
export function GetClient(): ReveniumPerplexity {
  if (!clientInstance) {
    throw new Error(
      "Revenium Perplexity client not initialized. Call Initialize() or Configure() first."
    );
  }
  return clientInstance;
}

/**
 * Check if client has been initialized
 * @returns {boolean} True if client is initialized
 */
export function IsInitialized(): boolean {
  return clientInstance !== null;
}

/**
 * Reset the client instance (useful for testing)
 */
export function Reset(): void {
  clientInstance = null;
}
