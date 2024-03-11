const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');

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
app.use(cookieParser());
app.use('/', transactionRoutes);
app.use('/', userRoutes);

// Catch-all route to serve Angular app for non-API requests
app.get("*", function (req, res) {
  res.sendFile(path.join(angularAppDirectory, "index.html"));
});

module.exports = app;