const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  if (!JWT_SECRET) {
    return next(new Error("JWT_SECRET is not configured."));
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET);
    if (!Number.isSafeInteger(decoded.userId) || decoded.userId <= 0) {
      return res.status(401).json({ message: "Invalid token." });
    }

    req.user = { id: decoded.userId };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = { verifyToken };
