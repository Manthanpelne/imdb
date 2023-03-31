const express = require("express")
const cors = require("cors")
const app = express();
require('dotenv').config()
const {connection} = require("./db");
const {userRouter} = require("./routes/userroute")
const {movieRouter} = require("./routes/movieroute")
const {commentRouter} = require("./routes/commentroute")

const {authenticate} = require("./middlewares/authenticate")
const {authorize} = require("./middlewares/authorize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var cookieParser = require('cookie-parser')

const redis = require("redis")
const client=redis.createClient()


client.on("error",(err)=>console.log("Redis client error",err))
client.connect()




const server = app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log(`running at server ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
})

io= require("socket.io")(server)


app.use(cookieParser())

io.on("connection",(socket)=>{
    console.log("client connected")
   
 socket.on("comment",(data)=>{
    data.time = Date()
    socket.broadcast.emit("comment",data)
 })

 socket.on("typing",(data)=>{
    socket.broadcast.emit("typing",data)
 })
})



app.use(cors());

app.use(express.json())


app.use("/user",userRouter)
app.use("/movie",movieRouter)
app.use("/api",commentRouter)







