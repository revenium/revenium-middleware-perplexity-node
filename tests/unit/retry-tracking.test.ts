import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Retry Tracking", () => {
  beforeEach(async () => {
    jest.resetModules();
    delete process.env.REVENIUM_RETRY_NUMBER;
    delete process.env.REVENIUM_PARENT_TRANSACTION_ID;
    delete process.env.REVENIUM_TRANSACTION_NAME;
  });

  describe("getRetryNumber", () => {
    it("should return null when not set", async () => {
      const { getRetryNumber } = await import(
        "../../src/utils/trace-fields.js"
      );
      expect(getRetryNumber()).toBeNull();
    });

    it("should return parsed number when set", async () => {
      process.env.REVENIUM_RETRY_NUMBER = "3";
      const { getRetryNumber } = await import(
        "../../src/utils/trace-fields.js"
      );
      expect(getRetryNumber()).toBe(3);
    });

    it("should return null for invalid number", async () => {
      process.env.REVENIUM_RETRY_NUMBER = "invalid";
      const { getRetryNumber } = await import(
        "../../src/utils/trace-fields.js"
      );
      expect(getRetryNumber()).toBeNull();
    });

    it("should handle zero", async () => {
      process.env.REVENIUM_RETRY_NUMBER = "0";
      const { getRetryNumber } = await import(
        "../../src/utils/trace-fields.js"
      );
      expect(getRetryNumber()).toBe(0);
    });

    it("should return null for negative numbers", async () => {
      process.env.REVENIUM_RETRY_NUMBER = "-5";
      const { getRetryNumber } = await import(
        "../../src/utils/trace-fields.js"
      );
      expect(getRetryNumber()).toBeNull();
    });
  });

  describe("getParentTransactionId", () => {
    it("should return parent transaction ID when set", async () => {
      process.env.REVENIUM_PARENT_TRANSACTION_ID = "parent-txn-123";
      const { getParentTransactionId } = await import(
        "../../src/utils/trace-fields.js"
      );
      expect(getParentTransactionId()).toBe("parent-txn-123");
    });

    it("should return null when not set", async () => {
      const { getParentTransactionId } = await import(
        "../../src/utils/trace-fields.js"
      );
      expect(getParentTransactionId()).toBeNull();
    });
  });

  describe("getTransactionName", () => {
    it("should return transaction name when set", async () => {
      process.env.REVENIUM_TRANSACTION_NAME = "Answer Customer Question";
      const { getTransactionName } = await import(
        "../../src/utils/trace-fields.js"
      );
      expect(getTransactionName()).toBe("Answer Customer Question");
    });

    it("should return null when not set", async () => {
      const { getTransactionName } = await import(
        "../../src/utils/trace-fields.js"
      );
      expect(getTransactionName()).toBeNull();
    });
  });
});
