const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map();

const authRateLimit = (req, res, next) => {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.startedAt >= WINDOW_MS) {
    attempts.set(key, { startedAt: now, count: 1 });
    return next();
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - record.startedAt)) / 1000);
    res.setHeader("Retry-After", retryAfter);
    return res.status(429).json({ message: "Too many authentication attempts. Please try again later." });
  }

  record.count += 1;
  return next();
};

module.exports = { authRateLimit };
