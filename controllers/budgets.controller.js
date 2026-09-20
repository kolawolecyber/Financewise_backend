const prisma = require("../config/prisma");
const { parsePositiveAmount, parsePositiveInt } = require("../utils/validation");

const createBudget = async (req, res, next) => {
  const { title, amount, category, month } = req.body;
  const parsedAmount = parsePositiveAmount(amount);
  if (typeof title !== "string" || !title.trim() || !parsedAmount || typeof category !== "string" || !category.trim() || typeof month !== "string" || !month.trim()) {
    return res.status(400).json({ message: "title, a positive amount, category, and month are required." });
  }

  try {
    const budget = await prisma.budget.create({
      data: { title: title.trim(), amount: parsedAmount, category: category.trim(), month: month.trim(), userId: req.user.id },
    });
    return res.status(201).json(budget);
  } catch (error) {
    return next(error);
  }
};

const getAllBudget = async (req, res, next) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user.id }, include: { expenses: true }, orderBy: { createdAt: "desc" },
    });
    return res.json(budgets.map((budget) => {
      const totalSpent = budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      return { ...budget, totalSpent, remaining: budget.amount - totalSpent };
    }));
  } catch (error) {
    return next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid budget id." });

  try {
    const result = await prisma.budget.deleteMany({ where: { id, userId: req.user.id } });
    if (!result.count) return res.status(404).json({ message: "Budget not found." });
    return res.json({ message: "Budget deleted successfully." });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createBudget, getAllBudget, deleteBudget };
