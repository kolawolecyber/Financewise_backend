import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import request from "supertest";

process.env.JWT_SECRET = "test-secret-for-server-security";
process.env.FRONTEND_URL = "https://frontend.example";
process.env.NODE_ENV = "test";

const require = createRequire(import.meta.url);
const app = require("../server");

describe("request origin security", () => {
  it("provides a public health check for deployment monitoring", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("rejects state-changing requests from untrusted origins", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Origin", "https://attacker.example");

    expect(response.status).toBe(403);
  });

  it("allows state-changing requests from configured frontend origins", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Origin", "https://frontend.example");

    expect(response.status).toBe(204);
  });
});