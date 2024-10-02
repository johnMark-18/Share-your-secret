const express = require("express");
const router = express.Router();
const authMiddleware = require("./middleware");

router.get("/", authMiddleware, (req, res) => {
  res.render("submit");
});

module.exports = router;
