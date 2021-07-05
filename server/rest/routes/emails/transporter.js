const nodemailer = require("nodemailer");
require("dotenv").config();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    type: "login", // other is oauth2
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_SPECIFIC_PASSWORD
  }
});

module.exports = transporter;
