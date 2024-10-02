const express = require("express");
const router = express.Router();
const Secret = require("../models/secret");
const authMiddleware = require("./middleware");

router.post("/", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const ident = req.user.id;

  const newSecret = new Secret({
    userId: ident,
    content: content,
  });

  try {
    await newSecret.save();
    res.redirect("/secrets");
  } catch (err) {
    console.error("Error while saving secret:", err);
    res.status(500).send("Internal server error");
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const secrets = await Secret.find().sort({ createdAt: -1 });

    const otherUserSecrets = secrets.filter((secret) => {
      return secret.userId && secret.userId.toString() !== req.user.id;
    });

    res.render("secrets", { secrets: otherUserSecrets });
  } catch (err) {
    console.error("Error while fetching secrets:", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
