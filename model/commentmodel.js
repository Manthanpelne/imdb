const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
    username:{type:String, required:true},
    comment:{type:String, required:true}
},{timestamps:true})

const commentModel = mongoose.model("Comment",commentSchema)

module.exports = {commentModel}