const zod = require("zod");
const express = require("express")
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")
const router = express.Router();
const { userModel } = require("../db")
const app = express();
app.use(bodyParser.json());
app.use(express.json())
const { JWT_SECRET } = require("../config");

const validation = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    email: zod.string().email(),
    password:zod.string().min(5),
})

router.post("/signup", async (req,res)=>{
    console.log(req.body);
    const parsedBody = validation.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: parsedBody.error.errors,
        });
    }
    const { firstName, lastName, email, password } = parsedBody.data;
    console.log(firstName, lastName, email, password);
    const existingUser = await userModel.findOne({
        email:req.body.email
    })
    if(existingUser) {
        return res.status(411).json({
            message:"Email already taken"
        })
    };

    const insertUser = await userModel.create({
        firstName, 
        lastName, 
        email, 
        password
    })
    // insertUser.save();
    if ( insertUser ) {
        const token = jwt.sign(insertUser._id,JWT_SECRET);
        res.status(200).json({
            message: insertUser._id + "User created successfully",
            token:token,
    })
    }
    res.status(411).json({
        message:"Error occured",
    })
})




module.exports = router;