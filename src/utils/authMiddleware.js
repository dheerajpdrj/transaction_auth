const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1d",
  });
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET || "refreshsecret"
  );
};

exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) throw new Error("Authentication token not provided");

    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
      if (err) throw new Error("Invalid authentication token");
      req.user = user;
      next();
    });
  } catch (error) {
    console.error(error);
    res.send("Authentication Failed");
  }
};

exports.authenticateRefreshToken = (req, res, next) => {
  try {
    const refreshToken =
      req.body.refreshToken ||
      req.query.refreshToken ||
      req.headers["x-refresh-token"];
    if (!refreshToken) throw new Error("Refresh token not provided");

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "refreshsecret",
      (err, user) => {
        if (err) throw new Error("Invalid refresh token");
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error(error);
    res.send("Authentication Failed");
  }
};
