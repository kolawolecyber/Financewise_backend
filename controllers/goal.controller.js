const prisma = require("../config/prisma");
const { parseMonthDayYear, parsePositiveAmount, parsePositiveInt } = require("../utils/validation");


//create a goal
const createGoal = async (req, res) => {
  const userId = req.user.id;
  const { title, targetAmount, targetDate } = req.body;
  const parsedAmount = parsePositiveAmount(targetAmount);

  if (typeof title !== "string" || !title.trim() || !parsedAmount) {
    return res.status(400).json({ error: "title and a positive target amount are required." });
  }

  const parsedDate = parseMonthDayYear(targetDate, "targetDate");
  if (parsedDate.error) return res.status(400).json({ error: parsedDate.error });

  try {
    const goal = await prisma.goal.create({
      data: {
        title: title.trim(),
        targetAmount: parsedAmount,
        targetDate: parsedDate.value,
        userId,
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error("Goal creation failed:", error);
    res.status(500).json({ message: "Failed to create goal." });
  }
};

// Get all goals for a user
const getUserGoals = async (req, res) => {
  const userId = req.user.id;

  try {
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch goals." });
  }
};

//update goal
const updateGoal = async (req, res) => {
  const goalId = parsePositiveInt(req.params.id);
  const amount = parsePositiveAmount(req.body.amount);
  if (!goalId) return res.status(400).json({ error: "Invalid goal id." });
  if (!amount) return res.status(400).json({ error: "A positive amount is required." });

  try{
  const result = await prisma.goal.updateMany({
    where: { id: goalId, userId: req.user.id },
    data: { savedAmount: { increment: amount } },
  });
  if (!result.count) return res.status(404).json({ error: "Goal not found." });

  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId: req.user.id } });

  res.json(goal);
} catch (error) {
    res.status(500).json({ message: "Failed to update goal." });
  }
};

//edit goal
const editGoal = async (req, res) => {
  const goalId = parsePositiveInt(req.params.id);
  const { title, targetAmount, targetDate} = req.body;
  const parsedAmount = parsePositiveAmount(targetAmount);

  if (!goalId) return res.status(400).json({ error: "Invalid goal id." });
  if (typeof title !== "string" || !title.trim() || !parsedAmount) {
    return res.status(400).json({ error: "title and a positive target amount are required." });
  }

  const parsedDate = parseMonthDayYear(targetDate, "targetDate");
  if (parsedDate.error) return res.status(400).json({ error: parsedDate.error });

  try{
  const result = await prisma.goal.updateMany({
    where: { id: goalId, userId: req.user.id },
    data: {
      title: title.trim(),
      targetAmount: parsedAmount,
      targetDate: parsedDate.value,
    },
  });
  if (!result.count) return res.status(404).json({ error: "Goal not found." });

  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId: req.user.id } });

  res.json(goal);
} catch (error) {
    console.error("Edit goal failed:", error);
    res.status(500).json({ message: "Failed to edit the goal." });
  }
};


const deleteGoal = async (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid goal id." });

  try {
    const result = await prisma.goal.deleteMany({ where: { id, userId: req.user.id } });
    if (!result.count) return res.status(404).json({ error: "Goal not found." });
    res.json({ message: "Goal deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Could not delete goal." });
  }
};
module.exports = {
  createGoal,
  getUserGoals,
  updateGoal,
  editGoal,
  deleteGoal,
};
