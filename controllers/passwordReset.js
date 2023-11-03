import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import  dotenv from 'dotenv';
import User from '../models/userModel.js';


dotenv.config();

// Generate a random reset token and set the expiration time
const generateResetToken = () => {
  const token = Math.random().toString(36).substr(2, 10);
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
  return { token, expires };
};

// Send a reset email to the user
// const sendResetEmail = async (user, resetToken) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail', // e.g., Gmail
//     auth: {
//       user: 'your_email@gmail.com',
//       pass: 'your_email_password',
//     },
//   });

//   const mailOptions = {
//     from: 'your_email@gmail.com',
//     to: user.email,
//     subject: 'Password Reset',
//     text: `To reset your password, please click this link: ${resetToken}`,
//   };




const sendResetEmail = async (user, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset',
    text: `To reset your password, please click this link: ${resetToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Controller to initiate the password reset process
const initiatePasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const resetInfo = generateResetToken();
    user.resetPasswordToken = resetInfo.token;
    user.resetPasswordExpires = resetInfo.expires;
    await user.save();

    sendResetEmail(user, resetInfo.token);

    res.json({ message: 'Password reset email sent.' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { initiatePasswordReset };
