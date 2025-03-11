const nodemailer = require('nodemailer');

const sendEmail = (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const mailOptions = {
    from: 'raniya182002@gmail.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log('Error sending email:', error);
    else console.log('Email sent:', info.response);
  });
};

module.exports = { sendEmail };
