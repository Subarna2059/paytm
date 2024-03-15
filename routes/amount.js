const express = require("express");
const app = express();
const {balanceModel, userModel} = require("../db");
const router = express.Router();
const {authMiddleware} = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
router.use(express.json());
app.use(express());

router.get("/balance", authMiddleware,async (req,res)=>{
    const availableBalance = await balanceModel.findOne({userId:req.userId});
    res.json({
        balance:availableBalance.balance
    })
})

router.post("/send", authMiddleware, async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount, to} = req.body;
    const sendingUser = await balanceModel.findOne({userId:req.userId}).session(session);
    if (!sendingUser || sendingUser.balance < amount) {
        await session.abortTransaction();
        res.status(400).json({
            msg:"Insufficient balance"
        });
    }
    const toUser = await balanceModel.findOne({userId:to}).session(session);
    if (!toUser) {
        await session.abortTransaction();
        res.send({
            msg:"Invalid user"
        });
    };

    await balanceModel.updateOne({userId:req.userId}, {$inc :{balance: -amount}}).session(session);
    await balanceModel.updateOne({userId:to},{$inc:{balance:amount}}).session(session);
    await session.commitTransaction();
    res.status(200).json({
        msg:"Transfer successful"
    });
    
})
module.exports=router