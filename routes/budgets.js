const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgets.controller');
const { verifyToken } = require('../middleware/expenseAuthMiddleware');



// Create budget
router.post('/', verifyToken, budgetController.createBudget);

// get all budgets for a user
router.get('/', verifyToken, budgetController.getAllBudget);

// delete budget
router.delete('/:id', verifyToken, budgetController.deleteBudget);
module.exports = router;
