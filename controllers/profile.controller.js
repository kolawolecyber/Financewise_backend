const prisma = require("../config/prisma");

// GET User Settings
const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        monthlyIncome: true,
        currency: true,
        financialGoal: true,
        profilePic: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE User Settings
const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { monthlyIncome, currency, financialGoal, profilePic } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyIncome:monthlyIncome ? parseFloat(monthlyIncome) : null,
        currency,
        financialGoal,
        profilePic,
      },
      select: {
        id: true,
        name: true,
        email: true,
        monthlyIncome: true,
        currency: true,
        financialGoal: true,
        profilePic: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserSettings, updateUserSettings };
