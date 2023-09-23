/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like 'Gmail','Mail gun','Mail trap','send grid')
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT, // if secure false port = 587 , if true port = 465
    // secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });
  // 2) Define Email Options (like from ,to,subject,email content)
  const opts = {
    from: "E-shop App <magdahmed624@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //Send email
  await transporter.sendMail(opts);
};

module.exports = sendEmail;
