import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRequire } from "node:module";

const { prisma } = vi.hoisted(() => ({
  prisma: {
    category: { findFirst: vi.fn() },
    transaction: { create: vi.fn(), deleteMany: vi.fn() },
  },
}));

const require = createRequire(import.meta.url);
require.cache[require.resolve("../config/prisma")] = { exports: prisma };
const { createTransaction, deleteTransaction } = require("../controllers/transaction.controller");

const response = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("transaction controller", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects a transaction without the required category", async () => {
    const res = response();
    await createTransaction({ user: { id: 1 }, body: { title: "Salary", amount: 100, type: "income" } }, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(prisma.transaction.create).not.toHaveBeenCalled();
  });

  it("rejects a category owned by another user", async () => {
    prisma.category.findFirst.mockResolvedValue(null);
    const res = response();
    await createTransaction({ user: { id: 1 }, body: { title: "Salary", amount: 100, type: "income", categoryId: 2 } }, res, vi.fn());
    expect(prisma.category.findFirst).toHaveBeenCalledWith({ where: { id: 2, userId: 1 } });
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("scopes deletion to the authenticated user", async () => {
    prisma.transaction.deleteMany.mockResolvedValue({ count: 0 });
    const res = response();
    await deleteTransaction({ user: { id: 1 }, params: { id: "99" } }, res, vi.fn());
    expect(prisma.transaction.deleteMany).toHaveBeenCalledWith({ where: { id: 99, userId: 1 } });
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
