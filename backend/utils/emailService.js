// utils/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send verification email
  async sendVerificationEmail(email, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    
    const message = {
      from: `Alumni Connection <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Verify Your Email</h1>
        <p>Thank you for registering with the Alumni Connection Platform.</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you did not create this account, please ignore this email.</p>
      `
    };

    try {
      await this.transporter.sendMail(message);
      console.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    const message = {
      from: `Alumni Connection <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Password Reset',
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested a password reset for your Alumni Connection account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="padding: 10px 15px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this reset, please ignore this email and your password will remain unchanged.</p>
        <p>This link is valid for 10 minutes only.</p>
      `
    };

    try {
      await this.transporter.sendMail(message);
      console.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  // Send welcome email after verification
  async sendWelcomeEmail(email, name) {
    const message = {
      from: `Alumni Connection <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Welcome to Alumni Connection Platform',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for verifying your email and joining our Alumni Connection Platform.</p>
        <p>You now have full access to our platform features:</p>
        <ul>
          <li>Connect with fellow alumni</li>
          <li>Discover networking events</li>
          <li>Explore job opportunities</li>
          <li>Participate in alumni initiatives</li>
        </ul>
        <p>We're excited to have you as part of our community!</p>
        <a href="${process.env.CLIENT_URL}/login" style="padding: 10px 15px; background-color: #673AB7; color: white; text-decoration: none; border-radius: 5px;">Login to Your Account</a>
      `
    };

    try {
      await this.transporter.sendMail(message);
      console.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
