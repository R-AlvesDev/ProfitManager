// transaction.model.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  type: String,
  date: { type: Date, get: (val) => val.toISOString().split('T')[0] }
});

transactionSchema.set('toJSON', { getters: true });
transactionSchema.set('toObject', { getters: true });

module.exports = mongoose.model('Transaction', transactionSchema);
