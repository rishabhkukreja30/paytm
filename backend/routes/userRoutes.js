const { Router } = require("express");
const { signUpBody, signInBody } = require("../types");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const router = Router();

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

router.post("/signin", async (req, res) => {
  const { success } = signInBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Error while logging in",
    });
  }

  const isUserPresent = await User.findOne({
    username: req.body.username,
  });

  if (!isUserPresent) {
    return res.status(400).json({
      message: "User not found",
    });
  } else {
    if (await isUserPresent.validatePassword(req.body.password)) {
      console.log(await isUserPresent.validatePassword(req.body.password));
      const userId = isUserPresent._id;

      const token = jwt.sign({ userId }, JWT_SECRET);

      return res.status(200).json({
        token: token,
      });
    } else {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }
  }
});

module.exports = router;
