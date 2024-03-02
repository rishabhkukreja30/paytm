const { Router } = require("express");
const userRouter = require("./userRoutes");
const accountRouter = require("./accountRoutes");

const router = Router();

router.use("/users", userRouter);
router.use("/accounts", accountRouter);

module.exports = router;
