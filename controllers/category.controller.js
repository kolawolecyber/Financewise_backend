const prisma = require("../config/prisma");

const createCategory = async (req, res) => {
  const userId = req.user.id;
  const { name, type, color } = req.body;

  try {
    const category = await prisma.category.create({
      data: {
        name,
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


const deleteCategory = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // ✅ Make sure this is defined BEFORE using it
    const linkedTransactions = await prisma.transaction.findMany({
      where: { categoryId: id },
    });

    if (linkedTransactions.length > 0) {
      return res.status(400).json({
        error: "Cannot delete category with linked transactions.",
      });
    }

    await prisma.category.delete({ where: { id } });

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
