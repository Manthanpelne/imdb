const express = require("express")
const commentRouter = express.Router()
const {commentModel} = require("../model/commentmodel")


commentRouter.post("/comments",async(req,res)=>{
    try {
      const comment = new commentModel({
        username:req.body.username,
        comment:req.body.comment
      })  
     await comment.save()
     res.send(comment)
    } catch (error) {
        console.log(error.message)
    }
})


commentRouter.get("/comments",(req,res)=>{
    try {
        commentModel.find().then((comment)=>{
         res.send(comment)
        })
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = {commentRouter}