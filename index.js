const express = require("express")
const cors = require("cors")
const app = express();
const {connection} = require("./db");
const {userRouter} = require("./routes/userroute")
const {movieRouter} = require("./routes/movieroute")
const { userModel } = require("./models/usermodel");
const {authenticate} = require("./middleware/authenticate")
const {authorize} = require("./middleware/authorize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

require('dotenv').config()


app.use(cors());

app.use(express.json())


app.use("/user",userRouter)
app.use("/movie",movieRouter)



app.listen(process.env.port,async()=>{
try {
    await connection
    console.log(`running at server ${process.env.port}`)
} catch (error) {
    console.log(error)
}
})