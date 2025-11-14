/**
 * Revenium Perplexity Client
 *
 * Main client class that wraps Perplexity API with Revenium tracking
 */

import OpenAI from "openai";
import { ChatInterface } from "./interfaces.js";
import type { ReveniumConfig } from "../../types/index.js";

/**
 * Revenium Perplexity client with usage tracking
 */
export class ReveniumPerplexity {
  private client: OpenAI;
  private config: ReveniumConfig;

  constructor(config: ReveniumConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.perplexityApiKey,
      baseURL: config.perplexityBaseUrl,
    });

    if (config.debug) {
      console.log("[Revenium] Perplexity client created", {
        baseURL: config.perplexityBaseUrl,
      });
    }
  }

  /**
   * Get chat interface
   */
  chat(): ChatInterface {
    return new ChatInterface(this.client, this.config);
  }

  /**
   * Get underlying OpenAI client (for advanced use cases)
   */
  getUnderlyingClient(): OpenAI {
    return this.client;
  }
}

