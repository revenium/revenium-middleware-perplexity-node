import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Environment Detection", () => {
  beforeEach(async () => {
    jest.resetModules();
    delete process.env.REVENIUM_ENVIRONMENT;
    delete process.env.NODE_ENV;
    delete process.env.DEPLOYMENT_ENV;
  });

  it("should return REVENIUM_ENVIRONMENT when set", async () => {
    process.env.REVENIUM_ENVIRONMENT = "production";
    const { getEnvironment } = await import("../../src/utils/trace-fields.js");
    expect(getEnvironment()).toBe("production");
  });

  it("should fallback to NODE_ENV when REVENIUM_ENVIRONMENT not set", async () => {
    process.env.NODE_ENV = "development";
    const { getEnvironment } = await import("../../src/utils/trace-fields.js");
    expect(getEnvironment()).toBe("development");
  });

  it("should fallback to DEPLOYMENT_ENV when others not set", async () => {
    process.env.DEPLOYMENT_ENV = "staging";
    const { getEnvironment } = await import("../../src/utils/trace-fields.js");
    expect(getEnvironment()).toBe("staging");
  });

  it("should return null when no environment variables set", async () => {
    const { getEnvironment } = await import("../../src/utils/trace-fields.js");
    expect(getEnvironment()).toBeNull();
  });

  it("should truncate environment longer than 255 characters", async () => {
    const longEnv = "a".repeat(300);
    process.env.REVENIUM_ENVIRONMENT = longEnv;
    const { getEnvironment } = await import("../../src/utils/trace-fields.js");
    const result = getEnvironment();
    expect(result).toHaveLength(255);
    expect(result).toBe(longEnv.substring(0, 255));
  });

  it("should trim whitespace from environment value", async () => {
    process.env.REVENIUM_ENVIRONMENT = "  production  ";
    const { getEnvironment } = await import("../../src/utils/trace-fields.js");
    expect(getEnvironment()).toBe("production");
  });

  it("should prioritize REVENIUM_ENVIRONMENT over NODE_ENV", async () => {
    process.env.REVENIUM_ENVIRONMENT = "production";
    process.env.NODE_ENV = "development";
    const { getEnvironment } = await import("../../src/utils/trace-fields.js");
    expect(getEnvironment()).toBe("production");
  });
});

