import { afterEach, describe, expect, it } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { getAuthCookieOptions } = require("../config/auth");

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  delete process.env.AUTH_COOKIE_SAMESITE;
});

describe("auth cookie configuration", () => {
  it("uses a cross-site secure cookie in production by default", () => {
    process.env.NODE_ENV = "production";

    expect(getAuthCookieOptions()).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  });

  it("uses a local-development-compatible cookie outside production", () => {
    process.env.NODE_ENV = "development";

    expect(getAuthCookieOptions()).toMatchObject({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  });
});