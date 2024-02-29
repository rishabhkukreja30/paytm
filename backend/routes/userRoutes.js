const { Router } = require("express");
const { signUpBody } = require("../types");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { log } = require("console");

const router = Router();

router.get("/signup", (req, res) => {
  res.send("vhvhfvw");
});

router.post("/signup", async (req, res) => {
  const { success } = signUpBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(400).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  let hashedPassword = await user.createHash(req.body.password);
  user.password = hashedPassword;

  await user.save();

  const userId = user._id;

  const token = jwt.sign({ userId }, JWT_SECRET);

  return res.status(201).json({
    message: "User created successfully",
    token: token,
  });
});

module.exports = router;
