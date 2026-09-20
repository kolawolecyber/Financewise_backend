const jwt = require("jsonwebtoken");
const { AUTH_COOKIE } = require("../config/auth");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  if (!JWT_SECRET) {
    return next(new Error("JWT_SECRET is not configured."));
  }

  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cookieHeader = req.headers.cookie || "";
  const cookieToken = cookieHeader
    .split(";")
    .map((part) => {
      const separator = part.indexOf("=");
      return separator === -1
        ? []
        : [part.slice(0, separator).trim(), part.slice(separator + 1)];
    })
    .find(([name]) => name === AUTH_COOKIE)?.[1];
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(decodeURIComponent(token), JWT_SECRET);
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
