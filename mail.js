const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'issac.cruickshank31@ethereal.email',
        pass: '6D7xWxvcENGuepYM2N'
    }
});

transporter.sendMail({
    to:'issac.cruickshank31@ethereal.email',
    from:"manthanpelneoo7@gmail.com",
    subject:"manthan from Node.js",
    text:"hellooooooo",
    html:"<h1>welcome</h1>"
})
.then(()=>{
    console.log("email sent successfully")
}).catch((err)=>{
    console.log(err)
})