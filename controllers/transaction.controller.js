const prisma = require("../config/prisma");
const { parseMonthDayYear, parsePositiveAmount, parsePositiveInt } = require("../utils/validation");

const createTransaction = async (req, res, next) => {
  const { title, amount, type, date, categoryId } = req.body;
  const userId = req.user.id;
  const parsedAmount = parsePositiveAmount(amount);
  const parsedCategoryId = parsePositiveInt(categoryId);

  if (typeof title !== "string" || !title.trim() || !parsedAmount || !["income", "expense"].includes(type) || !parsedCategoryId) {
    return res.status(400).json({ message: "title, a positive amount, type (income or expense), and categoryId are required." });
  }

  const parsedDate = date ? parseMonthDayYear(date) : { value: new Date() };
  if (parsedDate.error) return res.status(400).json({ message: parsedDate.error });

  try {
    const category = await prisma.category.findFirst({ where: { id: parsedCategoryId, userId } });
    if (!category) return res.status(404).json({ message: "Category not found." });
    if (category.type !== type) return res.status(400).json({ message: "Transaction type must match the category type." });

    const transaction = await prisma.transaction.create({
      data: { title: title.trim(), amount: parsedAmount, type, date: parsedDate.value, userId, categoryId: parsedCategoryId },
      include: { category: true },
    });
    return res.status(201).json(transaction);
  } catch (error) {
    return next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid transaction id." });

  try {
    const result = await prisma.transaction.deleteMany({ where: { id, userId: req.user.id } });
    if (!result.count) return res.status(404).json({ message: "Transaction not found." });
    return res.json({ message: "Transaction deleted successfully." });
  } catch (error) {
    return next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id }, include: { category: true }, orderBy: { date: "desc" },
    });
    return res.json(transactions);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createTransaction, getTransactions, deleteTransaction };
