const express = require("express");
const User = require("../models/user.js");
const router = new express.Router();

//user register route
router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//users login route
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.user_email,
      req.body.user_password
    );
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

//users reading
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
});

//user reading
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not Found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
});

//user update
router.patch("/update/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "user_name",
    "user_email",
    "user_password",
    "user_location",
    "user_info",
    "vehicle_info",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send("User not Found");
    }

    res.send(user);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong: ", error });
  }
});

module.exports = router;
