import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Trace Name Validation", () => {
  beforeEach(async () => {
    jest.resetModules();
    delete process.env.REVENIUM_TRACE_NAME;
  });

  it("should return trace name when set", async () => {
    process.env.REVENIUM_TRACE_NAME = "Support Ticket #12345";
    const { getTraceName } = await import("../../src/utils/trace-fields.js");
    expect(getTraceName()).toBe("Support Ticket #12345");
  });

  it("should return null when not set", async () => {
    const { getTraceName } = await import("../../src/utils/trace-fields.js");
    expect(getTraceName()).toBeNull();
  });

  it("should accept any characters", async () => {
    process.env.REVENIUM_TRACE_NAME = "Support Ticket #12345 @user";
    const { getTraceName } = await import("../../src/utils/trace-fields.js");
    expect(getTraceName()).toBe("Support Ticket #12345 @user");
  });

  it("should truncate trace name longer than 256 characters", async () => {
    const longName = "a".repeat(300);
    process.env.REVENIUM_TRACE_NAME = longName;
    const { getTraceName } = await import("../../src/utils/trace-fields.js");
    const result = getTraceName();
    expect(result).toHaveLength(256);
    expect(result).toBe(longName.substring(0, 256));
  });

  it("should accept exactly 256 characters", async () => {
    const exactName = "a".repeat(256);
    process.env.REVENIUM_TRACE_NAME = exactName;
    const { getTraceName } = await import("../../src/utils/trace-fields.js");
    expect(getTraceName()).toBe(exactName);
  });
});

