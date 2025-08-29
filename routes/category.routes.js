const express = require("express");
const { verifyToken } = require("../middleware/expenseAuthMiddleware");
const {
  createCategory,
  getCategories,deleteCategory
} = require("../controllers/category.controller");

const router = express.Router();

router.post("/", verifyToken, createCategory);
router.get("/", verifyToken, getCategories);
router.delete("/:id", verifyToken,deleteCategory );

module.exports = router;
