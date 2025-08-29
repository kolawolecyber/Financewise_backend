const prisma = require("../config/prisma"); 

// create budget 
const createBudget = async (req, res) => {
  const { title, amount, category, month } = req.body;

  try {
    const budget = await prisma.budget.create({
      data: {
        title,
        amount,
        category,
        month,
        userId: req.userId
      }
    });
    res.status(201).json(budget);
  } catch (err) {
    console.error('Budget create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all budgets for a user
const getAllBudget = async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId },
      include: {
        expenses: true, // 👈 This pulls in the related expenses
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich with totalSpent and remaining balance
    const enrichedBudgets = budgets.map((budget) => {
      const totalSpent = budget.expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );

      return {
        ...budget,
        totalSpent,
        remaining: budget.amount - totalSpent,
      };
    });

    res.json(enrichedBudgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBudget = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.budget.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete expense" });
  }
};
module.exports = {
    createBudget,
    getAllBudget,
    deleteBudget,
};