const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authMiddleware = require("./middleware");

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

router.put("/:id",authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findById(userId);
    
    if (!existingUser) {
      return res.status(404).send("User not found");
    }

    if (req.body.name) {
      existingUser.name = req.body.name;
    }

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      existingUser.password = hashedPassword;
    }

    await existingUser.save();
    res.status(200).send("User updated successfully");
  } catch (err) {
    console.error("Error while updating user:", err);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:id",authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    await Secret.deleteMany({ userId: userId });

    res.status(200).send("User and secrets deleted successfully");
  } catch (err) {
    console.error("Error while deleting user and secrets:", err);
    res.status(500).send("Internal server error");
  }
});



module.exports = router;
