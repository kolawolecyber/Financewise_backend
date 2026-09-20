const prisma = require("../config/prisma");
const { parsePositiveInt } = require("../utils/validation");

// Create a category 
const createCategory = async (req, res) => {
  const userId = req.user.id;
  const { name, type, color } = req.body;

  if (typeof name !== "string" || !name.trim() || !["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "name and type (income or expense) are required." });
  }

  if (color !== undefined && (typeof color !== "string" || !/^#[0-9a-fA-F]{6}$/.test(color))) {
    return res.status(400).json({ message: "color must be a six-digit hex color." });
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        type,
        color,
        userId,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create category." });
  }
};
// Get all cayegories for a user
const getCategories = async (req, res) => {
  const userId = req.user.id;

  try {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
};

//delete category
const deleteCategory = async (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid category id." });

  try {
    const category = await prisma.category.findFirst({ where: { id, userId: req.user.id } });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

   
    const linkedTransactions = await prisma.transaction.findMany({
      where: { categoryId: id, userId: req.user.id },
    });

    if (linkedTransactions.length > 0) {
      return res.status(400).json({
        error: "Cannot delete category with linked transactions.",
      });
    }

    await prisma.category.deleteMany({ where: { id, userId: req.user.id } });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete Category Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  createCategory,
  getCategories,
  deleteCategory
};
