const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];


  try {
    const decoded = jwt.verify(token, JWT_SECRET);
 
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user; // ✅ Full user
     next();
       
  } catch (error) {
     console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = { verifyToken };
