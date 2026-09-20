const prisma = require("../config/prisma");
const { parseMonthDayYear, parsePositiveAmount, parsePositiveInt } = require("../utils/validation");

const validateExpense = ({ description, amount, category, date, budgetId }) => {
  const parsedAmount = parsePositiveAmount(amount);
  const parsedBudgetId = parsePositiveInt(budgetId);
  const parsedDate = parseMonthDayYear(date);
  if (typeof description !== "string" || !description.trim() || !parsedAmount || typeof category !== "string" || !category.trim() || !parsedBudgetId || parsedDate.error) {
    return { error: "description, a positive amount, category, a valid date, and budgetId are required." };
  }
  return { value: { description: description.trim(), amount: parsedAmount, category: category.trim(), date: parsedDate.value, budgetId: parsedBudgetId } };
};

const createExpense = async (req, res, next) => {
  const validated = validateExpense(req.body);
  if (validated.error) return res.status(400).json({ message: validated.error });

  try {
    const budget = await prisma.budget.findFirst({ where: { id: validated.value.budgetId, userId: req.user.id } });
    if (!budget) return res.status(404).json({ message: "Budget not found." });
    const expense = await prisma.expense.create({ data: { ...validated.value, userId: req.user.id } });
    return res.status(201).json(expense);
  } catch (error) {
    return next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await prisma.expense.findMany({ where: { userId: req.user.id }, orderBy: { date: "desc" } });
    return res.json(expenses);
  } catch (error) {
    return next(error);
  }
};

const updateExpense = async (req, res, next) => {
  const id = parsePositiveInt(req.params.id);
  const validated = validateExpense(req.body);
  if (!id) return res.status(400).json({ message: "Invalid expense id." });
  if (validated.error) return res.status(400).json({ message: validated.error });

  try {
    const budget = await prisma.budget.findFirst({ where: { id: validated.value.budgetId, userId: req.user.id } });
    if (!budget) return res.status(404).json({ message: "Budget not found." });
    const result = await prisma.expense.updateMany({ where: { id, userId: req.user.id }, data: validated.value });
    if (!result.count) return res.status(404).json({ message: "Expense not found." });
    const expense = await prisma.expense.findUnique({ where: { id } });
    return res.json(expense);
  } catch (error) {
    return next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid expense id." });
  try {
    const result = await prisma.expense.deleteMany({ where: { id, userId: req.user.id } });
    if (!result.count) return res.status(404).json({ message: "Expense not found." });
    return res.json({ message: "Expense deleted successfully." });
  } catch (error) {
    return next(error);
  }
};

const getExpensesByBudget = async (req, res, next) => {
  const budgetId = parsePositiveInt(req.params.budgetId);
  if (!budgetId) return res.status(400).json({ message: "Invalid budget id." });
  try {
    const budget = await prisma.budget.findFirst({ where: { id: budgetId, userId: req.user.id } });
    if (!budget) return res.status(404).json({ message: "Budget not found." });
    const expenses = await prisma.expense.findMany({ where: { userId: req.user.id, budgetId } });
    return res.json(expenses);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createExpense, getExpenses, getExpensesByBudget, updateExpense, deleteExpense };
