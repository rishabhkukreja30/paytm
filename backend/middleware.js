const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({
      message: "Inavlid Credentials",
    });
  }

  const token = token.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (decodedToken.userId) {
      req.userId = decodedToken.userId;
      next();
    } else {
      res.status(403).json({
        message: "Inavlid Credentials",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Inavlid Credentials",
    });
  }
}

module.exports = {
  authMiddleware,
};
