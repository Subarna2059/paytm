const zod = require("zod");
const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router();
const { userModel,balanceModel } = require("../db")
const app = express();
app.use(express.json())
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware/auth");
router.use(express.json())

const validation = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    email: zod.string().email(),
    password:zod.string().min(5),
})
const updateValidation = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    email: zod.string().email().optional(),
    password:zod.string().min(5).optional(),
})
const signinValidation = zod.object({
    email: zod.string().email(),
      password: zod.string(),
})

router.post("/signup", async (req,res)=>{
    const parsedBody = validation.safeParse(req.body);
    if (!parsedBody.success) {
         res.status(400).json({
            message: "Invalid request body",
            errors: parsedBody.error.errors,
        });
    }
    const existingUser = await userModel.findOne({
        email:req.body.email
    })
    if(existingUser) {
         res.status(411).json({
            message:"Email already taken"
        })
    };

    const insertUser = await userModel.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:req.body.password,
    })
    const userId = insertUser._id;
    if ( insertUser ) {
        const token = jwt.sign({userId},JWT_SECRET);
        res.status(200).json({
            message: userId + "User created successfully",
            token:token,
    })
    }
})

router.post("/signin", async (req,res)=>{
    const parsedBody = signinValidation.safeParse(req.body);
    if(!parsedBody) {
        res.status(411).json([
            parsedBody.error.errors,
        ])
    }
    const user = await userModel.findOne({
        email:req.body.email,
        password: req.body.password
    });
    if (!user) {
        res.status(411).json({
            msg:"Sorry user not found"
    })
    }
    
    const userId = user._id;
    const assignBalance = await balanceModel.create({
        userId:userId,
        balance: 1 + Math.random() * 10000
    })
    const verify = jwt.sign({userId},JWT_SECRET);
    res.json({
        msg:"signin succesful",
        token: verify,
        balance:assignBalance.balance
    })
})

router.put("/update", authMiddleware, async (req,res)=>{
    const validation = updateValidation.safeParse(req.body);
    if(!validation) {
        res.status(411).json({
            msg:"error while updating",
        })
    }
    const update = await userModel.updateOne({_id:req.userId},req.body);
    res.json({
        msg:"Data upated successfully"
    })
})

router.get("/bulk", async (req,res) => {
    const filter = req.query.filter || " ";
    const regExp = new RegExp(filter,"i");
    const user = await userModel.find({
        $or:[{
            firstName:{'$regex':regExp}
        },{
            lastName:{'$regex':regExp}
        }]
    })
    res.json({
        user
    })
})




module.exports = router;