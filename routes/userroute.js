const express = require("express")
const userRouter = express.Router()
const { userModel } = require("../models/usermodel");
const {authenticate} = require("../middleware/authenticate")
const{authorize}=require("../middleware/authorize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const fs = require("fs")
require('dotenv').config()


userRouter.get("/",(req,res)=>{
    res.send("base api endpoint")
})




///////////-------------cookies--------------------//
// userRouter.get("/welcome",(req,res)=>{
//     const name =req.cookies.name||""
//     const location =req.cookies.location||""
//     res.send(`Welcome ${name} from ${location}`)
// })

// userRouter.get("/users",(req,res)=>{
//     res.cookie("name","manthan")
//     res.cookie("location","pune")
//     res.send("welcome userr")
// })
// userRouter.get("/admins",(req,res)=>{
//     res.send("welcome admin")
// })


////-----------------/////

userRouter.post("/signup",(req,res)=>{
    const {name,email,pass,role} = req.body
    bcrypt.hash(pass, 5, async function(err, hash) {
        const user = new userModel({
            name:name,
            email:email,
            pass:hash,
            role
        })
        await user.save()
        res.send({"msg":"registration successfull"})
        console.log(user)
    });
})

userRouter.post("/login",async(req,res)=>{
    try {
        const {email,pass}=req.body
        const user = await userModel.findOne({email})
        if(!user){
            res.status(400).send({"msg":"please register first"})
        }
        const hashpass = user?.pass
        bcrypt.compare(pass, hashpass, function(err, result) {
            if(result){
                try {
                    const token = jwt.sign(
                     {userID:user._id,"role":user.role},
                      "secret",
                      { expiresIn: "1d" }
                    );

                    return res.send({"msg":"Login successfull",token: token,user});
                  } catch (error) {
                    return res.send(error.message);
                  }
            }else{
                res.status(400).send({"msg":"login failed!!"})
            }
        });
    } catch (error) {
        console.log(error)
    }
})


// userRouter.get("/protected",(req,res)=>{
//     const token = req.headers.authorization;
//     client.get(token,(err,data)=>{
//         res.send(data)
//     })
// })


userRouter.get("/reports",authenticate,(req,res)=>{
res.send("reports..")
})

//------blacklisting-----//

userRouter.get("/logout",(req,res)=>{
const token = req.headers.authorization
try {
    const blacklisteddata = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
    blacklisteddata.push(token)
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklisteddata))
    res.send({"msg":"Logged out successfully"})
} catch (error) {
    console.log(error)
}
})


//----------refreshtoken------------//

userRouter.get("/gettoken",(req,res)=>{ 
    const reftoken = req.headers.authorization
    if(!reftoken){
        res.status(400).send("Login again!")
    }
    jwt.verify(reftoken, process.env.secondkey, function(err,decoded) {
        if(err){
            res.status(400).send({msg:"Please login again","err":err.message})
        }else{
            const token = jwt.sign({userID:decoded.userID},process.env.secretkey,{expiresIn:"1d"})
            res.send({"msg":"login successfull",token})
        }
      });
res.send()
})


module.exports = {userRouter}