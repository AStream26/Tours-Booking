const nodemailer = require('nodemailer');

const sendMail =  async options =>{
    //1) create transporter
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "5743f63eeb5093",
          pass: "6544711bf442c0"
        }
      });

      //2) mail options
      const option= {
          from :"Astream26 <avikr407@gmail.com>",
          to : options.mail,
          subject: options.subject,
          text:options.message
      }

      await transport.sendMail(option);
}
module.exports = sendMail;