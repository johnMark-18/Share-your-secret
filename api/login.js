const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      return res.status(401).send("Login failed: Incorrect email or password.");
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).send("Login failed: Incorrect email or password.");
    }

    //token generation
    const token = jwt.sign(
      { id: foundUser._id, email: foundUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/secrets");
  } catch (err) {
    console.error("error while logging in:", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
