const express = require("express");
const commentRouter = express.Router();
const { commentModel } = require("../model/commentmodel");
const {authenticate} = require("../middlewares/authenticate")

const mongoose = require("mongoose")

commentRouter.post("/comment",async (req, res) => {
  const id = req.headers.authorization
  try {
    const { username, comment } = req.body;
    const comments = new commentModel({
      username,
      comment,
      movie_id:id,
    });
    await comments.save();
    res.send({comments,"msg":"comment added"});
  } catch (error) {
    console.log(error.message);
  }
});

commentRouter.get("/getcomments", async (req, res) => {
  const id = req.headers.authorization
  try {
    const data1 = await commentModel.find({ movie_id:id }).populate("_id");
    res.send(data1);
  } catch (error) {
    console.log(error.message);
  }
});


commentRouter.delete("/delete",async(req,res)=>{
const  id = req.headers.authorization
const combox = await commentModel.findByIdAndDelete({_id:id})
res.send({"msg":"review deleted",combox})
})

module.exports = { commentRouter };
