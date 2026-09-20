import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRequire } from "node:module";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";
const require = createRequire(import.meta.url);
const { verifyToken } = require("../middleware/expenseAuthMiddleware");

const response = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("authentication middleware", () => {
  beforeEach(() => vi.clearAllMocks());

  it("authenticates a valid HTTP-only auth cookie", () => {
    const token = jwt.sign({ userId: 7 }, process.env.JWT_SECRET);
    const req = { headers: { cookie: `financewise_token=${token}` } };
    const res = response();
    const next = vi.fn();

    verifyToken(req, res, next);

    expect(req.user).toEqual({ id: 7 });
    expect(next).toHaveBeenCalledOnce();
  });

  it("rejects a token without a valid positive user id", () => {
    const token = jwt.sign({ userId: "7" }, process.env.JWT_SECRET);
    const req = { headers: { cookie: `financewise_token=${token}` } };
    const res = response();
    const next = vi.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});