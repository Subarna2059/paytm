const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const app = express();
app.use(express());

function authMiddleware (req,res,next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(403).json({});
    }
    const arrHeader = header.split(" ");
    const token =  arrHeader[1];
    try {
    const verify = jwt.verify(token,JWT_SECRET);
       req.userId = verify.userId
       next();
} catch(error) {
    res.status(403).json({
        msg:"auth failed",

    })
}

}

module.exports = {
    authMiddleware
}