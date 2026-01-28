import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Trace Type Validation", () => {
  beforeEach(async () => {
    jest.resetModules();
    delete process.env.REVENIUM_TRACE_TYPE;
  });

  it("should return trace type when valid", async () => {
    process.env.REVENIUM_TRACE_TYPE = "customer_support";
    const { getTraceType } = await import("../../src/utils/trace-fields.js");
    expect(getTraceType()).toBe("customer_support");
  });

  it("should return null when not set", async () => {
    const { getTraceType } = await import("../../src/utils/trace-fields.js");
    expect(getTraceType()).toBeNull();
  });

  it("should accept alphanumeric characters", async () => {
    process.env.REVENIUM_TRACE_TYPE = "trace123";
    const { getTraceType } = await import("../../src/utils/trace-fields.js");
    expect(getTraceType()).toBe("trace123");
  });

  it("should accept hyphens", async () => {
    process.env.REVENIUM_TRACE_TYPE = "customer-support";
    const { getTraceType } = await import("../../src/utils/trace-fields.js");
    expect(getTraceType()).toBe("customer-support");
  });

  it("should accept underscores", async () => {
    process.env.REVENIUM_TRACE_TYPE = "customer_support";
    const { getTraceType } = await import("../../src/utils/trace-fields.js");
    expect(getTraceType()).toBe("customer_support");
  });

  it("should reject special characters", async () => {
    process.env.REVENIUM_TRACE_TYPE = "customer@support";
    const { getTraceType } = await import("../../src/utils/trace-fields.js");
    expect(getTraceType()).toBeNull();
  });

  it("should reject spaces", async () => {
    process.env.REVENIUM_TRACE_TYPE = "customer support";
    const { getTraceType } = await import("../../src/utils/trace-fields.js");
    expect(getTraceType()).toBeNull();
  });

  it("should truncate trace type longer than 128 characters", async () => {
    const longType = "a".repeat(150);
    process.env.REVENIUM_TRACE_TYPE = longType;
    const { getTraceType } = await import("../../src/utils/trace-fields.js");
    const result = getTraceType();
    expect(result).toHaveLength(128);
    expect(result).toBe(longType.substring(0, 128));
  });

  it("should accept exactly 128 characters", async () => {
    const exactType = "a".repeat(128);
    process.env.REVENIUM_TRACE_TYPE = exactType;
    const { getTraceType } = await import("../../src/utils/trace-fields.js");
    expect(getTraceType()).toBe(exactType);
  });
});

