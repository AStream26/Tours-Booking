const nodemailer = require('nodemailer');
const pug    = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user,url){
     this.to = user.email,
     this.firstName = user.name.split(' ')[0],
     this.url = url,
     this.from = `Astream26 <${process.env.EMAIL_FROM}>`
  }
 
  //creating a transport
  newcreateTransport(){

    if(process.env.NODE_ENV==='production'){
     //sendgrid
   //  console.log("SEND");
     return nodemailer.createTransport({
       service :'SendGrid',
       auth:{
        user: process.env.SENDGRID_EMAIL,
        pass: process.env.SENDGRID_PASS
       }
     })
    }
    return nodemailer.createTransport({
      host: process.env.HOST_DEV_EMAIL,
      port: process.env.PORT_DEV_EMAIL,
      auth: {
        user: process.env.USER_DEV_EMAIL,
        pass: process.env.PASS_DEV_EMAIL 
      }
    });

  }

// sending the mail
 async send(template,subject){
    //send the actual mail

    //1)Render HTML  based on PUG template
    const html =  pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
      firstName:this.firstName,
      url:this.url,
      subject
    });

    //2)Define Email options
    const option= {
      from :this.from,
      to : this.to,
      subject,
      html,
      text:htmlToText.fromString(html)
  }

  //create a transport and send mail  await transport.sendMail(option);
    await this.newcreateTransport().sendMail(option);
  }


  //various type of mails

  async sendWelcome(){
    await this.send('welcome','Welcome to the Natours Family')
  }
  async sendforgotPassword(){
    await this.send('resetPassword','Your Password reset token (valid for 10 minute)')
  }



}

