const express = require('express')
const dotenv = require("dotenv");
const bodyparser = require('body-parser')
const cors = require('cors')
const nodemailer = require('nodemailer')
const sendGridTransporter = require('nodemailer-sendgrid-transport')

dotenv.config();

const app = express()

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

const transporter = nodemailer.createTransport(

  sendGridTransporter({
    auth:{
      api_key: process.env.API_SENDGRID
    }
  })
)

app.post('/sendemail', ( req, res ) =>
 {
  const { name, email, jobType, message } = req.body;

  if(!name){
    return res.status(400).json({error: "Please add your name"});
  }
  
  if(!email){
    return res.status(400).json({error: "Please add your e-mail"});
  }

  if(!email.includes("@")){
    return res.status(400).json({error: "Enter a valid e-mail address"});
  }

  if(!message){
    return res.status(400).json({error: "Please add your message"});
  }

  if(!jobType){
    return res.status(400).json({error: "Please chose job type"});
  }

  transporter.sendMail({
    to: 'adammocarski22@gmail.com',
    from:'adammocarski22@gmail.com',
    subject:'MY PORTFOLIO JOB OFFERS',
    html:`
    <h5> Details Information</h5>

    <ul>
      <li> <p>Name: ${name}</p></li>
      <li> <p>E-mail: ${email}</p></li>
      <li> <p>Jobtypes: ${jobType}</p></li>
      <li> <p>Message: ${message}</p></li>
    </ul>
    `
  })
  res.json({success: "Your e-mail has been sent"})
})

app.set("port", process.env.PORT || 8080);

app.listen(8080, () => {
  console.log(`Listening on 8080`);
});