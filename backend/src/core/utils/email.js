import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // 1. Create a transporter (Use Mailtrap.io for testing, or your Gmail credentials)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: 'RoleSync Admin <hello@rolesync.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};