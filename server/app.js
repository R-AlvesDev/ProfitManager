// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Transaction = require('./transaction.model'); // Adjust path if needed

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const connectionString = 'mongodb://localhost:27017'; // Replace with your actual string
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// API endpoints
app.post('/transactions', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.json({ message: 'Transaction created successfully' });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

// ... other endpoints as needed

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
