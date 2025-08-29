const express = require("express");
const { verifyToken } = require("../middleware/expenseAuthMiddleware");
const {
  createTransaction,
  getTransactions,deleteTransaction
} = require("../controllers/transaction.controller");

const router = express.Router();

router.post("/", verifyToken, createTransaction);
router.get("/", verifyToken, getTransactions);
router.delete("/:id", verifyToken, deleteTransaction);

module.exports = router;
