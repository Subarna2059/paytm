const mongoose = require("mongoose");
const{Schema} = mongoose;
mongoose.connect("mongodb+srv://subernathapa6:X7O8eyLdSMQd1lOO@cluster0.sidgews.mongodb.net/paytm");
const userSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password: String,
});

const balanceSchema = mongoose.Schema({
    userId:{type:Schema.Types.ObjectId,ref:"User"} ,
    balance:Number,
}
)

const userModel = mongoose.model("User", userSchema);
const balanceModel = mongoose.model("Balance", balanceSchema);
module.exports = {
    userModel,
    balanceModel
}
