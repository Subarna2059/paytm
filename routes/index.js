const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const amountRouter = require("./amount")
constamountRouter = require("./amount");
router.use("/user", userRouter);
router.use("/amount", amountRouter);
module.exports = router
