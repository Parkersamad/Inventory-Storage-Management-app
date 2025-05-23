const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  // Create a transporter
  const trasnporter = nodemailer.createTransport({
    host: process.env.EMAIL_PORT,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // Options for sending email.
  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    from: sent_from,
    html: message,
  };

  // Send email
  trasnporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
        console.log(info);
      //console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
