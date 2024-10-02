const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.username });
    if (existingUser) {
      return res.status(400).send("Registration failed: Email already in use.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      email: req.body.username,
      password: hashedPassword,
    });

    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.error("Error while adding new user:", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
