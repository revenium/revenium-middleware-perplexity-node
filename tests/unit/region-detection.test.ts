import { describe, it, expect, beforeEach } from "@jest/globals";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Region Detection", () => {
  beforeEach(async () => {
    jest.resetModules();
    mockedAxios.get.mockClear();
    delete process.env.AWS_REGION;
    delete process.env.AZURE_REGION;
    delete process.env.GCP_REGION;
    delete process.env.REVENIUM_REGION;
  });

  it("should return AWS_REGION when set", async () => {
    await jest.isolateModulesAsync(async () => {
      process.env.AWS_REGION = "us-east-1";
      const { getRegion } = await import("../../src/utils/trace-fields.js");
      const region = await getRegion();
      expect(region).toBe("us-east-1");
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });

  it("should return AZURE_REGION when AWS_REGION not set", async () => {
    await jest.isolateModulesAsync(async () => {
      process.env.AZURE_REGION = "eastus";
      const { getRegion } = await import("../../src/utils/trace-fields.js");
      const region = await getRegion();
      expect(region).toBe("eastus");
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });

  it("should return GCP_REGION when AWS and Azure not set", async () => {
    await jest.isolateModulesAsync(async () => {
      process.env.GCP_REGION = "us-central1";
      const { getRegion } = await import("../../src/utils/trace-fields.js");
      const region = await getRegion();
      expect(region).toBe("us-central1");
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });

  it("should return REVENIUM_REGION when other regions not set", async () => {
    await jest.isolateModulesAsync(async () => {
      process.env.REVENIUM_REGION = "custom-region";
      const { getRegion } = await import("../../src/utils/trace-fields.js");
      const region = await getRegion();
      expect(region).toBe("custom-region");
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });

  it("should fetch from AWS metadata service when no env vars set", async () => {
    await jest.isolateModulesAsync(async () => {
      const axios = (await import("axios")).default;
      const mockedGet = axios.get as jest.MockedFunction<typeof axios.get>;
      mockedGet.mockResolvedValueOnce({ data: "us-west-2" } as any);

      const { getRegion } = await import("../../src/utils/trace-fields.js");
      const region = await getRegion();
      expect(region).toBe("us-west-2");
      expect(mockedGet).toHaveBeenCalledWith(
        "http://169.254.169.254/latest/meta-data/placement/region",
        { timeout: 500 }
      );
    });
  });

  it("should return null when metadata service fails", async () => {
    await jest.isolateModulesAsync(async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
      const { getRegion } = await import("../../src/utils/trace-fields.js");
      const region = await getRegion();
      expect(region).toBeNull();
    });
  });

  it("should cache region after first call", async () => {
    await jest.isolateModulesAsync(async () => {
      process.env.AWS_REGION = "us-east-1";
      const { getRegion } = await import("../../src/utils/trace-fields.js");

      const region1 = await getRegion();
      const region2 = await getRegion();

      expect(region1).toBe("us-east-1");
      expect(region2).toBe("us-east-1");
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });

  it("should trim whitespace from region value", async () => {
    await jest.isolateModulesAsync(async () => {
      process.env.AWS_REGION = "  us-east-1  ";
      const { getRegion } = await import("../../src/utils/trace-fields.js");
      const region = await getRegion();
      expect(region).toBe("us-east-1");
    });
  });

  it("should reset cache when resetRegionCache is called", async () => {
    await jest.isolateModulesAsync(async () => {
      process.env.AWS_REGION = "us-east-1";
      const { getRegion, resetRegionCache } = await import(
        "../../src/utils/trace-fields.js"
      );

      const region1 = await getRegion();
      expect(region1).toBe("us-east-1");

      resetRegionCache();
      delete process.env.AWS_REGION;
      process.env.AWS_REGION = "us-west-2";

      const region2 = await getRegion();
      expect(region2).toBe("us-west-2");
    });
  });
});
