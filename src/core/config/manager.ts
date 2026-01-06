/**
 * Configuration Manager Module
 *
 * Handles global configuration state management and logging.
 */

import { ReveniumConfig, Logger } from "../../types/index.js";
import { loadConfigFromEnv } from "./loader.js";
import { validateConfig } from "./validator.js";
import { setConfig as setSummaryPrinterConfig } from "../../utils/summary-printer.js";

/**
 * Global configuration instance
 */
let globalConfig: ReveniumConfig | null = null;

/**
 * Default console logger implementation
 */
export const defaultLogger: Logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (globalConfig?.debug || process.env.REVENIUM_DEBUG === "true") {
      console.debug(`[Revenium Debug] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    console.info(`[Revenium] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[Revenium Warning] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[Revenium Error] ${message}`, ...args);
  },
};

let globalLogger: Logger = defaultLogger;

/**
 * Get the current global configuration
 */
export function getConfig(): ReveniumConfig | null {
  return globalConfig;
}

/**
 * Set the global configuration
 */
export function setConfig(config: ReveniumConfig): void {
  validateConfig(config);
  globalConfig = config;
  globalLogger.debug("Revenium configuration updated", {
    baseUrl: config.reveniumBaseUrl,
    hasReveniumKey: !!config.reveniumApiKey,
    hasPerplexityKey: !!config.perplexityApiKey,
    printSummary: config.printSummary,
    teamId: config.teamId,
  });

  setSummaryPrinterConfig({
    reveniumApiKey: config.reveniumApiKey,
    reveniumBaseUrl: config.reveniumBaseUrl,
    teamId: config.teamId,
    printSummary: config.printSummary,
  });
}

/**
 * Get the current logger
 */
export function getLogger(): Logger {
  return globalLogger;
}

/**
 * Initialize configuration from environment variables
 */
export function initializeConfig(): ReveniumConfig {
  const envConfig = loadConfigFromEnv();

  if (!envConfig) {
    globalLogger.error(
      "Failed to load configuration from environment. Ensure REVENIUM_METERING_API_KEY and PERPLEXITY_API_KEY are set."
    );
    throw new Error(
      "Failed to load configuration from environment. Ensure REVENIUM_METERING_API_KEY and PERPLEXITY_API_KEY are set."
    );
  }

  setConfig(envConfig);
  globalLogger.debug(
    "Revenium middleware initialized from environment variables"
  );

  return envConfig;
}
