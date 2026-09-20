// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budgets');
const expenseRoutes = require("./routes/expense.routes");
const goalRoutes = require("./routes/goal.route");
const categoryRoutes = require("./routes/category.routes");
const transactionRoutes = require("./routes/transaction.route");
const userRoutes = require("./routes/profile.routes");


const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET === "your_super_secret_key")) {
  throw new Error("A strong JWT_SECRET must be configured before starting the production server.");
}
const isAllowedOrigin = (origin) => !origin || allowedOrigins.includes(origin);
// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // allow REST tools or server-to-server requests with no origin
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "100kb" }));
app.use((req, res, next) => {
  const origin = req.get("Origin");
  const stateChangingMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  if (stateChangingMethod && !isAllowedOrigin(origin)) {
    return res.status(403).json({ message: "Origin is not allowed." });
  }
  return next();
});
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use('/api/auth', authRoutes);

app.use('/api/budgets', budgetRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/goals", goalRoutes);

app.use("/api/categories", categoryRoutes);


app.use("/api/transactions", transactionRoutes);

app.use("/api/profile", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON body." });
  }
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin is not allowed." });
  }
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "Uploaded file is too large." });
  }
  if (error.message === "Only images (jpeg, jpg, png) are allowed") {
    return res.status(400).json({ message: error.message });
  }

  console.error("Unhandled request error:", error);
  return res.status(500).json({ message: "Internal server error." });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
