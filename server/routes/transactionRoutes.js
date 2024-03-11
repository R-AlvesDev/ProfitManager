const express = require('express');
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { authenticateToken } = require("../middleware");

// Route to create a new transaction
router.post("/transactions", authenticateToken, transactionController.createTransaction);
// Router to get Total Income
router.get("/transactions/totalIncome", authenticateToken, transactionController.getTotalIncome);
// Router to get Total Expenses
router.get("/transactions/totalExpenses", authenticateToken, transactionController.getTotalExpenses);
// Router to get Transactions by Month
router.get("/transactions/byMonth", authenticateToken, transactionController.getTransactionByMonth);
// Router to get Transactions by Month and Year
router.get("/transactions/byMonthYear", authenticateToken, transactionController.getTransactionByMonthYear);
// Router to get Spending (Total Expenses) by Category
router.get("/transactions/spendingByCategory", authenticateToken, transactionController.getSpendingByCategory);
// Router to get all transactions
router.get("/transactions", authenticateToken, transactionController.getTransactions);
// Router to get Transaction by ID
router.get("/transactions/:id", authenticateToken, transactionController.getTransactionById);
// Router to update a transaction
router.put("/transactions/:id", authenticateToken, transactionController.updateTransaction);
// Router to delete a transaction
router.delete("/transactions/:id", authenticateToken, transactionController.deleteTransaction);

module.exports = router;