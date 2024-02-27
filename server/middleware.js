const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // If the error is because the token expired, try to refresh it
      if (err.name === 'TokenExpiredError') {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) return res.sendStatus(403);

          const newAccessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
          req.user = { _id: user._id };
          res.cookie('accessToken', newAccessToken, { httpOnly: true });
        });
        next();
      } else {
        return res.sendStatus(403);
      }
    } else {
      req.user = { _id: user._id };
      next();
    }
  });
}

module.exports = {
  authenticateToken
};