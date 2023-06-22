const mongoose = require("mongoose")
const {Schema} = mongoose

const commentSchema = mongoose.Schema({
    username:{type:String, required:true},
    comment:{type:String, required:true},
    movie_id: {
        type: Schema.Types.ObjectId,
        ref: "movie",
        required: true,
      },
},{timestamps:true})

const commentModel = mongoose.model("Comment",commentSchema)

module.exports = {commentModel}