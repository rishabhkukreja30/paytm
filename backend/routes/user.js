const { Router } = require("express");
const { signUpBody } = require("..types/");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const router = Router();

router.post("/signup", async (req, res) => {
  const { success } = userInfo.safeParse(req.body);
  if (!success) {
    res.status(400).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    res.status(400).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id;

  const token = jwt.sign({ userId }, JWT_SECRET);

  res.status(201).json({
    message: "User created successfully",
    token: token,
  });
});

module.exports = router;
