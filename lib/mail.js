const nodemailer = require("nodemailer");
export async function sendMail(to, subject, html) {
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  // Setup email data
  const message = {
    from: { name: "Prodapt - AIO", address: "prodaptaio@gmail.com" },
    to: to,
    subject: subject,
    html: decodeURIComponent(html),
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
}
