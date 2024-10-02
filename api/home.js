const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.post("/", (req, res) => {
  res.clearCookie("token");
  console.log("user logged out");

  res.redirect("/");
});

module.exports = router;
