const express = require("express")
const userRouter = express.Router()
require('dotenv').config()
const {usermodel } = require("../model/usermodel");
const {authenticate} = require("../middlewares/authenticate")
const{authorize}=require("../middlewares/authorize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const redis = require("redis")
const client=redis.createClient()
const otp = require("generate-otp")



client.on("error",(err)=>console.log("Redis client error",err))
client.connect()



const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.apikey)


const generateOtp = require("generate-otp");



// const redis = require("redis")

// const client=redis.createClient()
// client.connect()

userRouter.get("/",authenticate,(req,res)=>{
    res.send("base api endpoint")
})

userRouter.get("/reports",authenticate,authorize("customer"),(req,res)=>{
	res.send("reports..")
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
    try {
        const {name,email,pass,otp,role} = req.body
        bcrypt.hash(pass, 5, async function(err, hash) {
            const user = new usermodel({
                name:name,
                email:email,
                pass:hash,
                otp,
                role
            })
            await user.save()
            res.send({"msg":"registration successfull"})
            console.log(user)
        });
    } catch (error) {
        console.log(error)
    }
})

userRouter.post("/login", async (req, res) => {
    const {email, pass} = req.body;

    const user = await usermodel.findOne({email})
    if(!user){
        res.status(400).send("Please signup first")
        return
    }
    const hashedpwd = user?.pass
    bcrypt.compare(pass, hashedpwd, function(err, result) {
        if(result){
            const token = jwt.sign({userID : user._id, role : user.role}, process.env.secretkey, {expiresIn : "3m"})
            const refresh_token = jwt.sign({userID : user._id, role:user.role}, process.env.secondkey, {expiresIn : "5m"})
            res.send({msg : "login successfull", token, user, refresh_token})
        }
        else{
            res.status(400).send("login failed")
        }
    });
})



//------blacklisting-----//

userRouter.get("/logout",(req,res)=>{
const token = req.headers.authorization
try {
    client.LPUSH("black",token)
    // const blacklisteddata = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
    // blacklisteddata.push(token)
    // fs.writeFileSync("./blacklist.json", JSON.stringify(blacklisteddata))
    res.send({"msg":"Logged out successfully"})
} catch (error) {
    console.log(error)
}
})


//----------refreshtoken------------//

userRouter.get("/getnewtoken",(req,res)=>{ 
    const reftoken = req.headers.authorization
    if(!reftoken){
        res.status(400).send("Login again!")
        return
    }
    jwt.verify(reftoken, process.env.secondkey, function(err,decoded) {
        if(err){
            res.status(400).send({msg:"Please login again","err":err.message})
        }else{
            const token = jwt.sign({userID:decoded.userID, role:decoded.role},process.env.secretkey,{expiresIn:"1d"})
            res.send({"msg":"login successfull",token})
        }
      });
})



//Email verificafion using OTP 

userRouter.post("/getotp",async(req,res)=>{
    try {
        const {email} = req.body
        if(!email){
            return res.status(400).send({"msg":"Enter Email first!"})
        }
        const mail = await usermodel.findOne({email})
        if(!mail){
            return res.status(400).send({"msg":"User not found, please register again."})
        }else{

            const generateOtp = otp.generate(4)
            client.LPUSH("otp",generateOtp.toString())
            const msg = {
                to:`${mail.email}`,
                from:"manthanpelneoo7@gmail.com",
                subject:"Email Verification",
                text:"Email Verification",
                html: `<p>Verify your email using OTP: <h1>${generateOtp}</h1></p>`,
            }
            sendgrid
              .send(msg)
              .then(() => {}, error => {
                console.error(error);
            
                if (error.response) {
                  console.error(error.response.body)
                }
              });
            res.send({"msg":"OTP sent successfully!!",generateOtp})
        }
    } catch (error) {
        console.log(error.message)
    }
})


userRouter.post("/verifyotp",async(req,res)=>{
    try {
        let otp = req.body.otp
        let result = await client.lRange('otp',0,99999999)
        
        if(!otp){
            return res.status(400).send({"msg":"Please insert OTP to verify your Email !!"})
        }
        if(otp!==result[0]){
         return res.status(400).send("Invalid OTP !!")
        }

    } catch (error) {
        console.log(error.message)
    }
    res.send({"msg":"Email successfully verified..!!"})
})

module.exports = {userRouter}