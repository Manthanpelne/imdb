const mongoose = require("mongoose")

const logoutSchema = mongoose.Schema({
    token:{type:String}
})

const LogoutModel = mongoose.model("blacklist",logoutSchema)

module.exports = {LogoutModel}