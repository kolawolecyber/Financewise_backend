const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/expenseAuthMiddleware");

const {
  createExpense,
  getExpenses,
  getExpensesByBudget,updateExpense,deleteExpense
} = require("../controllers/expense.controller");

router.post("/", verifyToken, createExpense);
router.get("/", verifyToken, getExpenses);
router.get("/budget/:budgetId", verifyToken, getExpensesByBudget);
router.put("/:id", verifyToken, updateExpense);
router.delete("/:id", verifyToken, deleteExpense);
module.exports = router;
