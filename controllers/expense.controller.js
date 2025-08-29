const prisma = require("../config/prisma"); 

const createExpense = async (req, res) => {
  const { description, amount, category, date, budgetId } = req.body;
  const userId = req.user.id;
  if (!description || !amount || !category || !date || !budgetId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format." });
  }
  try {
    const expense = await prisma.expense.create({
      data: {
        description,
        amount:parseFloat(amount),
        category,
        date: parsedDate,
        userId,
        budgetId,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating expense" });
  }
};

// expense.controller.js
const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch expenses" });
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { description, amount, category, date, budgetId } = req.body;

  try {
    const updated = await prisma.expense.update({
      where: { id: Number(id) },
      data: {
        description,
        amount:parseFloat(amount),
        category,
        date: new Date(date),
        budgetId,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Could not update expense" });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.expense.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete expense" });
  }
};


const getExpensesByBudget = async (req, res) => {
  const userId = req.user.id;
  const budgetId = parseInt(req.params.budgetId);
console.log("userId from token:", userId);
console.log("budgetId from request:", budgetId);
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        budgetId,
      },
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses for budget" });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpensesByBudget,
  updateExpense,
  deleteExpense
};
