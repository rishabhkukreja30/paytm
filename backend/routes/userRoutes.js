const { Router } = require("express");
const { signUpBody, signInBody, updateUserBody } = require("../types");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

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

  const hashedPassword = await user.createHash(req.body.password);
  user.password = hashedPassword;

  await user.save();

  const userId = user._id;

  // create new account
  await Account.create({ userId, balance: 1 + Math.random() * 10000 });

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

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateUserBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Error while updating information",
    });
  }

  try {
    const user = await User.findOne({ _id: req.userId });
    // const isPasswordSame = await user.validatePassword(req.body.password);
    if (
      (req.body.password && (await user.validatePassword(req.body.password))) ||
      req.body.firstName === user.firstName ||
      req.body.lastName === user.lastName
    ) {
      return res.status(403).json({
        message: "New credentials are same as current credentials",
      });
    }
    const updatedFields = {};

    if (req.body.password) {
      const hashedPassword = await user.createHash(req.body.password);
      updatedFields.password = hashedPassword;
    }
    if (req.body.firstName) {
      updatedFields.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      updatedFields.lastName = req.body.lastName;
    }
    await User.updateOne({ _id: req.userId }, updatedFields);

    return res.status(200).json({
      message: "User Profile Updated",
    });
  } catch (error) {
    return res.status(403).json({
      message: "Profile can't be updated",
    });
  }
});

router.get("/search", async (req, res) => {
  const name = req.query.name || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: new RegExp(name, "i"),
        },
      },
      {
        lastName: {
          $regex: new RegExp(name, "i"),
        },
      },
    ],
  });

  res.json({
    users: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
