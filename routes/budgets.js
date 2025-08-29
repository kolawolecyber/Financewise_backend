const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgets.controller');
const {authenticate} = require('../middleware/budgetAuthMiddleware')



// Create budget
router.post('/', authenticate, budgetController.createBudget);

// get all budgets for a user
router.get('/', authenticate, budgetController.getAllBudget);

// delete budget
router.delete('/:id', authenticate, budgetController.deleteBudget);
module.exports = router;