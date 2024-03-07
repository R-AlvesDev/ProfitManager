const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

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

// MongoDB connection
const connectionString = process.env.MONGO_CONNECTION; // Replace with your MongoDB connection string
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Catch-all route to serve Angular app for non-API requests
app.get("*", function (req, res) {
  res.sendFile(path.join(angularAppDirectory, "index.html"));
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));