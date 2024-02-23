const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const Transaction = require("./transaction.model");
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();

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

// Endpoint for User Registration
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint for User Login
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).send({ message: "Authentication failed" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint to get create a transaction
app.post("/transactions", async (req, res) => {
  try {
    const formattedDate = req.body.date.split("T")[0];
    const newTransaction = new Transaction({
      ...req.body,
      date: formattedDate,
    });
    await newTransaction.save();
    res.json({ message: "Transaction created successfully" });
    console.log("Transaction saved successfully");
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: "Error creating transaction" });
  }
});

// Endpoint to get total income
app.get("/transactions/totalIncome", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const totalIncome = await Transaction.aggregate([
      {
        $match: {
          type: "Income",
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
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
      {
        $match: {
          type: "Outcome",
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
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
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions by month:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Endpoint to get Transactions by Month and Year
app.get("/transactions/byMonthYear", async (req, res) => {
  const { month, year } = req.query;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the given month

  try {
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
    });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions by month and year:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Endpoint to get spending by Category
app.get('/transactions/spendingByCategory', async (req, res) => {
  try {
    const spendingByCategory = await Transaction.aggregate([
      { $match: { type: 'Outcome' } }, // Filter for transactions with type 'Outcome'
      { $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);
    res.json(spendingByCategory.map(item => {
      return { category: item._id, total: item.total };
    }));
  } catch (err) {
    console.error("Error fetching spending by category:", err);
    res.status(500).json({ message: "Error fetching data" });
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

// Endpoint to get transaction by id
app.get("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    console.error("Error fetching transaction:", err);
    res.status(500).json({ message: "Error fetching transaction" });
  }
});

// Endpoint to update a transaction
app.put('/transactions/:id', async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(updatedTransaction);
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ message: "Error updating transaction" });
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

// Then, catch-all route to serve Angular app for non-API requests
app.get("*", function (req, res) {
  res.sendFile(path.join(angularAppDirectory, "index.html"));
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
