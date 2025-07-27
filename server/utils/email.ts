import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

// Create a transporter object using Gmail SMTP with secure settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email credentials not configured');
    }
    
    const mailOptions = {
      from: `"Vibe Haven" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code - Vibe Haven',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Vibe Haven!</h2>
          <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
          <div style="text-align: center; margin: 25px 0;">
            <div style="
              display: inline-block; 
              padding: 15px 30px; 
              background-color: #f5f5f5; 
              border: 2px dashed #4CAF50;
              border-radius: 8px;
              font-size: 28px;
              letter-spacing: 5px;
              font-weight: bold;
              color: #333;
            ">
              ${otp}
            </div>
          </div>
          <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
          <p>If you didn't request this, please ignore this email or contact support if you have any concerns.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            This email was sent to ${email} because you registered at Vibe Haven.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};
