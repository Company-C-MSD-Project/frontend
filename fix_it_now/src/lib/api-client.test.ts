import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { tokens, useNewApi, apiBaseUrl } from "@/lib/api-client";

describe("tokens (localStorage-backed JWT store)", () => {
  beforeEach(() => localStorage.clear());

  it("stores and reads back the access and refresh tokens", () => {
    tokens.set("access-123", "refresh-456");
    expect(tokens.access).toBe("access-123");
    expect(tokens.refresh).toBe("refresh-456");
  });

  it("clear() removes both tokens", () => {
    tokens.set("access-123", "refresh-456");
    tokens.clear();
    expect(tokens.access).toBeNull();
    expect(tokens.refresh).toBeNull();
  });

  it("set(null, null) clears individual tokens", () => {
    tokens.set("a", "r");
    tokens.set(null, null);
    expect(tokens.access).toBeNull();
    expect(tokens.refresh).toBeNull();
  });
});

describe("useNewApi (feature flag parsing)", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is true only when the flag is the string 'true' (case-insensitive)", () => {
    vi.stubEnv("VITE_USE_NEW_API", "TRUE");
    expect(useNewApi()).toBe(true);
  });

  it("is false for any other value", () => {
    vi.stubEnv("VITE_USE_NEW_API", "false");
    expect(useNewApi()).toBe(false);
  });
});

describe("apiBaseUrl (base URL normalisation)", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("strips trailing slashes from the configured dev base URL", () => {
    vi.stubEnv("VITE_API_BASE_URL_DEV", "http://localhost:8080/");
    expect(apiBaseUrl()).toBe("http://localhost:8080");
  });

  it("returns the dev URL unchanged when it has no trailing slash", () => {
    vi.stubEnv("VITE_API_BASE_URL_DEV", "http://localhost:8080");
    expect(apiBaseUrl()).toBe("http://localhost:8080");
  });
});
