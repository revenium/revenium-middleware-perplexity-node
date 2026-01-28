import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Credential Alias", () => {
  beforeEach(async () => {
    jest.resetModules();
    delete process.env.REVENIUM_CREDENTIAL_ALIAS;
  });

  it("should return credential alias when set", async () => {
    process.env.REVENIUM_CREDENTIAL_ALIAS = "Production API Key";
    const { getCredentialAlias } = await import("../../src/utils/trace-fields.js");
    expect(getCredentialAlias()).toBe("Production API Key");
  });

  it("should return null when not set", async () => {
    const { getCredentialAlias } = await import("../../src/utils/trace-fields.js");
    expect(getCredentialAlias()).toBeNull();
  });

  it("should truncate credential alias longer than 255 characters", async () => {
    const longAlias = "a".repeat(300);
    process.env.REVENIUM_CREDENTIAL_ALIAS = longAlias;
    const { getCredentialAlias } = await import("../../src/utils/trace-fields.js");
    const result = getCredentialAlias();
    expect(result).toHaveLength(255);
    expect(result).toBe(longAlias.substring(0, 255));
  });

  it("should trim whitespace from credential alias", async () => {
    process.env.REVENIUM_CREDENTIAL_ALIAS = "  Production Key  ";
    const { getCredentialAlias } = await import("../../src/utils/trace-fields.js");
    expect(getCredentialAlias()).toBe("Production Key");
  });
});

