import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRequire } from "node:module";

const { prisma } = vi.hoisted(() => ({
  prisma: {
    goal: {
      create: vi.fn(),
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

const require = createRequire(import.meta.url);
require.cache[require.resolve("../config/prisma")] = { exports: prisma };
const { createGoal, updateGoal, editGoal, deleteGoal } = require("../controllers/goal.controller");

const response = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("goal controller", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects invalid goal amounts before writing", async () => {
    const res = response();
    await createGoal({ user: { id: 1 }, body: { title: "Emergency fund", targetAmount: "NaN", targetDate: "09/20/2026" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(prisma.goal.create).not.toHaveBeenCalled();
  });

  it("scopes savings updates to the authenticated user", async () => {
    prisma.goal.updateMany.mockResolvedValue({ count: 0 });
    const res = response();

    await updateGoal({ user: { id: 1 }, params: { id: "9" }, body: { amount: 50 } }, res);

    expect(prisma.goal.updateMany).toHaveBeenCalledWith({
      where: { id: 9, userId: 1 },
      data: { savedAmount: { increment: 50 } },
    });
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("scopes edits to the authenticated user", async () => {
    prisma.goal.updateMany.mockResolvedValue({ count: 0 });
    const res = response();

    await editGoal({ user: { id: 1 }, params: { id: "9" }, body: { title: "Fund", targetAmount: 500, targetDate: "09/20/2026" } }, res);

    expect(prisma.goal.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 9, userId: 1 } }));
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("scopes deletion to the authenticated user", async () => {
    prisma.goal.deleteMany.mockResolvedValue({ count: 0 });
    const res = response();

    await deleteGoal({ user: { id: 1 }, params: { id: "9" } }, res);

    expect(prisma.goal.deleteMany).toHaveBeenCalledWith({ where: { id: 9, userId: 1 } });
    expect(res.status).toHaveBeenCalledWith(404);
  });
});