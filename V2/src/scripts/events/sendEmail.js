const eventEmitter = require("./eventEmiter");
const nodemailer = require("nodemailer");

module.exports=()=>{
    eventEmitter.on("send_mail",(email_data)=>{
        let transporter2 = nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL_USER, 
              pass: 'ismwrqvarbyhbiuk', 
            }
          });
          let info =  transporter2.sendMail({
            from: process.env.EMAIL_FROM, // sender address
           ...email_data
          });
       
    });
    
    
   
};