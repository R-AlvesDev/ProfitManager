// transaction.model.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  category: String,
  date: Date,
});

module.exports = mongoose.model('Transaction', transactionSchema);
