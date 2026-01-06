import { getLogger } from "../core/config/index.js";
import axios from "axios";

const logger = getLogger();

let cachedRegion: string | null = null;
let regionCached = false;
let regionPromise: Promise<string | null> | null = null;

export function resetRegionCache(): void {
  cachedRegion = null;
  regionCached = false;
  regionPromise = null;
}

export function getEnvironment(): string | null {
  const env =
    process.env.REVENIUM_ENVIRONMENT ||
    process.env.NODE_ENV ||
    process.env.DEPLOYMENT_ENV ||
    null;

  if (!env) {
    return null;
  }

  const trimmed = env.trim();

  if (trimmed.length > 255) {
    logger.warn(
      `environment exceeds max length of 255 characters. Truncating.`
    );
    return trimmed.substring(0, 255);
  }

  return trimmed;
}

export async function getRegion(): Promise<string | null> {
  if (regionCached) {
    return cachedRegion;
  }

  if (regionPromise) {
    return regionPromise;
  }

  const envRegion =
    process.env.AWS_REGION ||
    process.env.AZURE_REGION ||
    process.env.GCP_REGION ||
    process.env.REVENIUM_REGION;

  if (envRegion) {
    cachedRegion = envRegion.trim();
    regionCached = true;
    return cachedRegion;
  }

  regionPromise = (async () => {
    try {
      const response = await axios.get(
        "http://169.254.169.254/latest/meta-data/placement/region",
        { timeout: 500 }
      );
      cachedRegion = response.data.trim();
      regionCached = true;
      regionPromise = null;
      return cachedRegion;
    } catch (error) {
      regionCached = false;
      regionPromise = null;
      return null;
    }
  })();

  return regionPromise;
}

export function getCredentialAlias(): string | null {
  const alias = process.env.REVENIUM_CREDENTIAL_ALIAS;

  if (!alias) {
    return null;
  }

  const trimmed = alias.trim();

  if (trimmed.length > 255) {
    logger.warn(
      `credentialAlias exceeds max length of 255 characters. Truncating.`
    );
    return trimmed.substring(0, 255);
  }

  return trimmed;
}

export function getTraceType(): string | null {
  const traceType = process.env.REVENIUM_TRACE_TYPE;

  if (!traceType) {
    return null;
  }

  let value = traceType;

  if (value.length > 128) {
    logger.warn(
      `trace_type exceeds max length of 128 characters: ${value}. Truncating.`
    );
    value = value.substring(0, 128);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
    logger.warn(
      `Invalid trace_type format: ${value}. Must be alphanumeric with hyphens/underscores only.`
    );
    return null;
  }

  return value;
}

export function getTraceName(): string | null {
  const traceName = process.env.REVENIUM_TRACE_NAME;

  if (!traceName) {
    return null;
  }

  if (traceName.length > 256) {
    logger.warn(`trace_name exceeds max length of 256 characters. Truncating.`);
    return traceName.substring(0, 256);
  }

  return traceName;
}

export function detectOperationSubtype(requestBody?: any): string | null {
  if (requestBody && (requestBody.tools || requestBody.functions)) {
    return "function_call";
  }
  return null;
}

export function getParentTransactionId(): string | null {
  return process.env.REVENIUM_PARENT_TRANSACTION_ID || null;
}

export function getTransactionName(): string | null {
  return process.env.REVENIUM_TRANSACTION_NAME || null;
}

export function getRetryNumber(): number | null {
  const retryNum = process.env.REVENIUM_RETRY_NUMBER;
  if (!retryNum) {
    return null;
  }
  const parsed = parseInt(retryNum, 10);
  if (isNaN(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}
