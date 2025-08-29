const prisma = require("../config/prisma");

const { parse, isValid } = require("date-fns");

const createTransaction = async (req, res) => {
  const userId = req.user.id;
  const { title, amount, type, date, categoryId } = req.body;

  let parsedDate;

  // Use current date if date not provided
  if (!date) {
    parsedDate = new Date();
  } else if (typeof date === "string") {
    parsedDate = parse(date, "MM/dd/yyyy", new Date());

    if (!isValid(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format. Use MM/dd/yyyy" });
    }
  } else {
    return res.status(400).json({ error: "Date must be a string" });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        date: parsedDate,
        userId,
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("🔥 Transaction creation failed:", error); // log full error
    res.status(500).json({ message: "Failed to create transaction.", error: error.message });
  }
};
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.transaction.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete expense" });
  }
};

const getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions." });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction
};
