const express = require("express")
const app = express();
const cors = require("cors")
const {connection} = require("./db");
const {userRouter} = require("./routes/userroute")
const {movieRouter} = require("./routes/movieroute")
const { userModel } = require("./models/usermodel");
const {authenticate} = require("./middleware/authenticate")
const {authorize} = require("./middleware/authorize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookie=require("cookie-parser")
require('dotenv').config()
const redis = require("redis")
const bp = require("body-parser")

const client=redis.createClient()
client.on("error",(err)=>console.log("Redis client error"))
client.connect()
app.use(bp.json())

app.use(cors())

app.use(express.json())
app.use(cookie())


app.use("/users",userRouter)
app.use("/movies",movieRouter)



app.listen(process.env.port,async()=>{
try {
    await connection
    console.log(`running at server ${process.env.port}`)
} catch (error) {
    console.log(error)
}
})