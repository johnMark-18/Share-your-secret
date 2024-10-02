const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  //console.log('Token received from cookie:', token);

  if (!token) {
    console.log("No token found. User needs to log in again.");
    return res.redirect("/");
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.redirect("/");
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  });
};

module.exports = authMiddleware;
