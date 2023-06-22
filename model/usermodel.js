const mongoose = require("mongoose")
const otp = require("generate-otp")

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    role:{type:String,enum:["customer"],default:"customer"}
})

const usermodel = mongoose.model("user",userSchema)

module.exports = {usermodel}