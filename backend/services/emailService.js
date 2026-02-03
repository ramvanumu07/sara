/**
 * Email Service - Sara Learning Platform
 * Handles email sending for password reset and other notifications
 */

import nodemailer from 'nodemailer'

// Email configuration
const EMAIL_CONFIG = {
  // Gmail configuration (most common)
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your-email@gmail.com
      pass: process.env.EMAIL_APP_PASSWORD // Gmail app password
    }
  },
  
  // Outlook/Hotmail configuration
  outlook: {
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  },
  
  // Custom SMTP configuration
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  }
}

// Create transporter based on configuration
function createTransporter() {
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail'
  
  if (!EMAIL_CONFIG[emailProvider]) {
    throw new Error(`Unsupported email provider: ${emailProvider}`)
  }
  
  const config = EMAIL_CONFIG[emailProvider]
  
  // Validate required environment variables
  if (!config.auth.user || !config.auth.pass) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD/EMAIL_APP_PASSWORD in .env')
  }
  
  return nodemailer.createTransporter(config)
}

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name
 * @returns {Promise<boolean>} - Success status
 */
export async function sendPasswordResetEmail(email, resetToken, userName = '') {
  try {
    const transporter = createTransporter()
    
    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
    
    // Email content
    const mailOptions = {
      from: {
        name: 'Sara Learning Platform',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Reset Your Sara Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: #10a37f; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; margin-bottom: 20px; color: #333; }
            .message { font-size: 16px; margin-bottom: 30px; line-height: 1.6; }
            .reset-button { display: inline-block; background: #10a37f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 16px; margin: 20px 0; }
            .reset-button:hover { background: #0d8a6c; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 14px; }
            .footer { background: #f8f9fa; padding: 20px 30px; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; color: #666; }
            .link-text { word-break: break-all; color: #666; font-size: 14px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Sara</h1>
            </div>
            <div class="content">
              <div class="greeting">
                Hi ${userName || 'there'},
              </div>
              <div class="message">
                You requested a password reset for your Sara Learning Platform account. Click the button below to create a new password:
              </div>
              <div style="text-align: center;">
                <a href="${resetLink}" class="reset-button">Reset My Password</a>
              </div>
              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons. If you didn't request this reset, please ignore this email.
              </div>
              <div class="message">
                If the button doesn't work, copy and paste this link into your browser:
              </div>
              <div class="link-text">
                ${resetLink}
              </div>
            </div>
            <div class="footer">
              <p>Best regards,<br>The Sara Team</p>
              <p>© 2026 Sara Learning Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${userName || 'there'},

You requested a password reset for your Sara Learning Platform account.

Click this link to reset your password:
${resetLink}

This link will expire in 1 hour for security.

If you didn't request this reset, please ignore this email.

Best regards,
The Sara Team

© 2026 Sara Learning Platform. All rights reserved.
      `.trim()
    }
    
    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log(`✅ Password reset email sent successfully to ${email}`)
    console.log(`📧 Message ID: ${info.messageId}`)
    
    return true
    
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error)
    
    // Log specific error details for debugging
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed - check EMAIL_USER and EMAIL_PASSWORD/EMAIL_APP_PASSWORD')
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed - check internet connection and SMTP settings')
    } else if (error.code === 'EMESSAGE') {
      console.error('📝 Message format error - check email content')
    }
    
    return false
  }
}

/**
 * Test email configuration
 * @returns {Promise<boolean>} - Success status
 */
export async function testEmailConfiguration() {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ Email configuration is valid')
    return true
  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message)
    return false
  }
}

export default {
  sendPasswordResetEmail,
  testEmailConfiguration
}