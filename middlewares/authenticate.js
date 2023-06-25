require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const {LogoutModel} = require("../model/logoutModel")


// const {createClient} = require("redis")
// const client=createClient(process.env.redisurl)
// client.on("error",(err)=>console.log("Redis client error",err))
// client.connect()


const cookieParser = require("cookie-parser")

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(400).send({"msg":"Login first"})
  }
  const logoutToken = await LogoutModel.find({token})
  if(logoutToken.length!=0){
    return res.status(400).send({"msg":"You are not logged in"})
  }
  // const blacklisteddata = JSON.parse(
  //   fs.readFileSync("./blacklist.json", "utf-8")
  // );

  // if (blacklisteddata.includes(token)) {
  //   return res.status(400).send("login again");
  // }

  //checking is the token  is present in redis.. if present? blacklist it
  // const result = await client.lRange('black',0,99999999)
  //     if(result.indexOf(token) > -1){
  //       return res.status(400).json({
  //         status: 400,
  //         error: 'Please Login again!!'
  //     })
  //   }

  let result = req.cookies.blacklist 
  if(result===token){
    return res.status(400).send({"msg":"Login first"})
  }


  jwt.verify(token, process.env.secretkey, function (err, decoded) {
    if (err) {
      res.status(400).send({ msg: "Please login again", err: err.message });
    } else {
      const userrole = decoded?.role;
      req.body.userrole = userrole;
      next();
    }
  });


};
module.exports = { authenticate };


