const mongoose = require('mongoose');
const app = require('./app');

require("dotenv").config();

// MongoDB connection
const connectionString = process.env.MONGO_CONNECTION; // Replace with your MongoDB connection string
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));