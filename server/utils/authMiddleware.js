const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    // 401 за и двата случая — frontend може да ги улови и auto-logout
    if (err) return res.status(401).json({ message: "Session expired. Please log in again." });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
