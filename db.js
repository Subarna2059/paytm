const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://subernathapa6:X7O8eyLdSMQd1lOO@cluster0.sidgews.mongodb.net/paytm");
const userSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password: String,
});

const userModel = mongoose.model("user", userSchema);
module.exports = {
    userModel,
}
