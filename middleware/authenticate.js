const jwt = require("jsonwebtoken")
const fs = require("fs")
require('dotenv').config()


const authenticate = async(req,res,next)=>{
const token = req.headers.authorization
if(!token){
  res.send("login again")
}
const blacklisteddata = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))

if(blacklisteddata.includes(token)){
 return  res.send("login again")
}

//checking is the token  is present in redis.. if present? blacklist it

    jwt.verify(token, process.env.secretkey, function(err, decoded) {
        if(err){
            res.status(400).send({msg:"Please login again","err":err.message})
        }else{
            const userrole = decoded?.role
            req.body.userrole=userrole
            next()
        }
      });
}
module.exports = {authenticate}