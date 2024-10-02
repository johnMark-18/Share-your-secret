const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Secret = require("../models/secret");
const authMiddleware = require("./middleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userSecrets = await Secret.find({ userId: req.user.id });

    res.render("profile", { user, userSecrets });
  } catch (err) {
    console.log("Error fetching profile data:", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
