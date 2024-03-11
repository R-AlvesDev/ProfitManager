const mongoose = require("mongoose");
const Transaction = require("../models/transaction.model");

exports.createTransaction = async (req, res) => {
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
};

exports.getTotalIncome = async (req, res) => {
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
};

exports.getTotalExpenses = async (req, res) => {
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
};

exports.getTransactionByMonth = async (req, res) => {
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
};

exports.getTransactionByMonthYear = async (req, res) => {
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
};

exports.getSpendingByCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const spendingByCategory = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: {
            $sum: "$amount",
          },
        },
      },
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
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

exports.getTransactionById = async (req, res) => {
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
};

exports.updateTransaction = async (req, res) => {
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
};

exports.deleteTransaction = async (req, res) => {
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
};
