const nodemailer = require("nodemailer");
const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 25,
      secure: true,
      auth: {
        user: "waseemanjum899@gmail.com",
        pass: "123456",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: "waseemanjum899@gmail.com",
      to: "waseemanjum899@gmail.com",
      subject: subject,
      text: text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
