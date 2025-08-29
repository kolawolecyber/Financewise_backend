const express = require("express");
const { verifyToken } = require("../middleware/expenseAuthMiddleware");
const { createGoal, getUserGoals, updateGoal, editGoal, deleteGoal } = require("../controllers/goal.controller");

const router = express.Router();

router.post("/", verifyToken, createGoal);
router.get("/", verifyToken, getUserGoals);
router.put('/:id/save', verifyToken, updateGoal);
router.put('/:id', verifyToken, editGoal);
router.delete('/:id', verifyToken, deleteGoal);

module.exports = router;
