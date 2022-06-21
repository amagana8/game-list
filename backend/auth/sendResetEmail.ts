import nodemailer from 'nodemailer';
import { HOST_URL } from '@utils/hostUrl';

export async function sendResetEmail(to: string, token: string) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Game List" <no-reply@game-list.com>',
    to,
    subject: 'GameList: Password Reset Request',
    html: `<h1>Password Reset</h1><a href="${HOST_URL}/change-password/${token}">Click here to reset your password</a><p>If you did not request a password reset, you can ignore this email.</p>`,
  });

  console.log('Message sent: %s', info.messageId);
}
