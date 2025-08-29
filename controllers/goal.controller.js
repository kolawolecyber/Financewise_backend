const prisma = require("../config/prisma");

const { parse, isValid } = require("date-fns");

const createGoal = async (req, res) => {
  const userId = req.user.id;
  const { title, targetAmount, targetDate } = req.body;

  if (!targetDate || typeof targetDate !== "string") {
    return res.status(400).json({ error: "Target date is required and must be a string." });
  }

  const parsedDate = parse(targetDate, "MM/dd/yyyy", new Date());

  if (!isValid(parsedDate)) {
    return res.status(400).json({ error: "Invalid target date provided." });
  }

  try {
    const goal = await prisma.goal.create({
      data: {
        title,
        targetAmount: parseFloat(targetAmount),
        targetDate: parsedDate,
        userId,
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error("Goal creation failed:", error);
    res.status(500).json({ message: "Failed to create goal." });
  }
};
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

 const updateGoal = async (req, res) => {
  const goalId = parseInt(req.params.id);
  const { amount } = req.body;

  try{

  const goal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      savedAmount: {
        increment: amount,
      },
    },
  });

  res.json(goal);
} catch (error) {
    res.status(500).json({ message: "Failed to fetch goals." });
  }
};


const editGoal = async (req, res) => {
  const goalId = parseInt(req.params.id);
  const { title, targetAmount, targetDate} = req.body;


 if (!targetDate || typeof targetDate !== "string") {
    return res.status(400).json({ error: "Target date is required and must be a string." });
  }

  const parsedDate = parse(targetDate, "MM/dd/yyyy", new Date());

  if (!isValid(parsedDate)) {
    return res.status(400).json({ error: "Invalid target date provided." });
  }

  try{

  const goal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      title,
      targetAmount:parseFloat(targetAmount),
      targetDate:parsedDate,
      
         },
  });

  res.json(goal);
} catch (error) {
   console.error("Edit goal failed:", error);
     console.error(error.stack);
    res.status(500).json({ message: "Failed to edit the goals.", error: error.message });
  }
};


const deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.goal.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete expense" });
  }
};
module.exports = {
  createGoal,
  getUserGoals,
  updateGoal,
  editGoal,
  deleteGoal,
};
