const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const Transaction = require("./transaction.model");

const app = express();

// Serve static files from the Angular app
const angularAppDirectory = path.join(
  __dirname,
  "../client/dist/profit-manager/browser"
); // Adjust the path according to your Angular dist directory structure
app.use(express.static(angularAppDirectory));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const connectionString = "mongodb://localhost:27017"; // Replace with your actual string
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// API endpoints

// Endpoint to get create a transaction
app.post("/transactions", async (req, res) => {
  try {
    const formattedDate = req.body.date.split('T')[0];
    const newTransaction = new Transaction({...req.body, date: formattedDate});
    await newTransaction.save();
    res.json({ message: "Transaction created successfully" });
    console.log("Transaction saved successfully");
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: "Error creating transaction" });
  }
});

// Endpoint to delete a transaction
app.delete("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ message: "Error deleting transaction" });
  }
});

// Endpoint to get total income
app.get("/transactions/totalIncome", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const totalIncome = await Transaction.aggregate([
      { $match: { type: "Income", date: {$gte: new Date(startDate), $lte: new Date(endDate)}} },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    res.json({ total: totalIncome[0]?.total || 0 });
  } catch (err) {
    console.error("Error fetching total income:", err);
    res.status(500).json({ message: "Error fetching total income" });
  }
});

// Endpoint to get total expenses
app.get("/transactions/totalExpenses", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const totalExpenses = await Transaction.aggregate([
      { $match: { type: "Outcome", date: {$gte: new Date(startDate), $lte: new Date(endDate)}} },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    res.json({ total: totalExpenses[0]?.total || 0 });
  } catch (err) {
    console.error("Error fetching total expenses:", err);
    res.status(500).json({ message: "Error fetching total expenses" });
  }
});

// Endpoint to get Transactions by Month
app.get("/transactions/byMonth", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions by month:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Endpoint to get Transactions by Month and Year
app.get('/transactions/byMonthYear', async (req, res) => {
  const { month, year } = req.query;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the given month

  try {
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate }
    });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions by month and year:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Endpoint to get all transactions
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Then, catch-all route to serve Angular app for non-API requests
app.get("*", function (req, res) {
  res.sendFile(path.join(angularAppDirectory, "index.html"));
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
