const express = require('express');
const app = express();
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/', transactionRoutes);
app.use('/', userRoutes);

module.exports = app;