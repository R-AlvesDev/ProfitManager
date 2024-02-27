const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const Transaction = require("./transaction.model");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const { authenticateToken } = require("./middleware");

require("dotenv").config();

// Serve static files from the Angular app
const angularAppDirectory = path.join(
  __dirname,
  "../client/dist/profit-manager/browser"
); // Adjust the path according to your Angular dist directory structure
app.use(express.static(angularAppDirectory));

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// MongoDB connection
const connectionString = "mongodb://localhost:27017"; // Replace with your MongoDB connection string
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Generate an access token
function generateAccessToken(userId) {
  return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

// Generate a refresh token
function generateRefreshToken(userId) {
  return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

// API endpoints

// Endpoint for User Registration
app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint for User Login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).send({ message: "Authentication failed" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set the refresh token as a HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send the access token to the client
    res.send({ user, accessToken });
  } catch (error) {
    console.log("Error logging in:", error);
    res.status(500).send(error);
  }
});

// Refresh endpoint
app.post("/refresh", (req, res) => {
  // Get the refresh token from the request cookies
  const refreshToken = req.cookies.refreshToken;

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Error verifying refresh token:", err);
      return res.sendStatus(403);
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user._id);

    // Send the access token to the client
    res.json({ accessToken });
  });
});

// Endpoint to get create a transaction
app.post("/transactions", authenticateToken, async (req, res) => {
  try {
    const newTransaction = new Transaction({
      ...req.body,
      date: req.body.date,
      userId: req.user._id,
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
app.get("/transactions/totalIncome", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      console.log({
        type: "Income",
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        userId: req.user._id,
      });
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const totalIncome = await Transaction.aggregate([
      {
        $match: {
          type: "Income",
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
          userId: new mongoose.Types.ObjectId(req.user._id),
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
app.get("/transactions/totalExpenses", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const totalExpenses = await Transaction.aggregate([
      {
        $match: {
          type: "Outcome",
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
          userId: new mongoose.Types.ObjectId(req.user._id),
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
app.get("/transactions/byMonth", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      userId: req.user._id,
    });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions by month:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Endpoint to get Transactions by Month and Year
app.get("/transactions/byMonthYear", authenticateToken, async (req, res) => {
  const { month, year } = req.query;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the given month

  try {
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
      userId: req.user._id,
    });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions by month and year:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Endpoint to get spending by Category
app.get(
  "/transactions/spendingByCategory",
  authenticateToken,
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const spendingByCategory = await Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user._id),
            type: 'expense'
          }
        },
        {
          $group: {
            _id: '$category',
            total: {
              $sum: '$amount'
            }
          }
        }
      ]);
      res.json(
        spendingByCategory.map((item) => {
          return { category: item._id, total: item.total };
        })
      );
    } catch (err) {
      console.error("Error fetching spending by category:", err);
      res.status(500).json({ message: "Error fetching data" });
    }
  }
);

// Endpoint to get all transactions
app.get("/transactions", authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// Endpoint to get transaction by id
app.get("/transactions/:id", authenticateToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).find({
      userId: req.user._id,
    });
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
app.put("/transactions/:id", authenticateToken, async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).find({ userId: req.user._id });
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
app.delete("/transactions/:id", authenticateToken, async (req, res) => {
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

// Catch-all route to serve Angular app for non-API requests
app.get("*", function (req, res) {
  res.sendFile(path.join(angularAppDirectory, "index.html"));
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
