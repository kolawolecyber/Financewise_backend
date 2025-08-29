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
const allowedOrigins = process.env.FRONTEND_URL.split(",");
// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // allow REST tools or server-to-server requests with no origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());



app.use('/api/auth', authRoutes);

app.use('/api/budgets', budgetRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/goals", goalRoutes);

app.use("/api/categories", categoryRoutes);


app.use("/api/transactions", transactionRoutes);

app.use("/api/profile", userRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
