// transaction.model.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  type: String,
  date: Date,
});

module.exports = mongoose.model('Transaction', transactionSchema);
