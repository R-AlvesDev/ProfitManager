const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Generate an access token
function generateAccessToken(userId) {
  return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

// Generate a refresh token
function generateRefreshToken(userId) {
  return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).send({ message: "Authentication failed" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set the refresh token as a HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send the access token to the client
    res.send({ user, accessToken });
  } catch (error) {
    console.log("Error logging in:", error);
    res.status(500).send(error);
  }
};

exports.refreshToken = async (req, res) => {
  // Get the refresh token from the request cookies
  const refreshToken = req.cookies.refreshToken;

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Error verifying refresh token:", err);
      return res.sendStatus(403);
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user._id);

    // Send the access token to the client
    res.json({ accessToken });
  });
};
