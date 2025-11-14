/**
 * Transaction ID Generator
 * 
 * Generates unique transaction IDs for tracking requests.
 * Format: txn_{timestamp}_{random}
 */

/**
 * Generate a unique transaction ID
 * 
 * @returns A unique transaction ID in format: txn_{timestamp}_{random}
 * 
 */
export function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

