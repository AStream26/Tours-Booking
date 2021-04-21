const nodemailer = require('nodemailer');
const pug    = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user,url){
     this.to = user.email,
     this.firstName = user.name.split(' ')[0],
     this.url = url,
     this.form = `Astream26 <${process.env.EMAIL_FROM}>`
  }
 
  //creating a transport
  newcreateTransport(){

    if(process.env.NODE_ENV==='production'){
     //sendgrid
     return 1;
    }
    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "5743f63eeb5093",
        pass: "6544711bf442c0"
      }
    });

  }

// sending the mail
 async send(template,subject){
    //send the actual mail

    //1)Render HTML  based on PUG template
    const html =  pug.renderFile(`${__dirname}/../views/emails/${tempalte}.pug`,{
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
    await this.send('Welcome','Welcome to the Natours Family')
  }



}

