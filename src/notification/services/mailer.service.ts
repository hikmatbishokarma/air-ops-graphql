import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST, // Example: smtp.example.com
    // port: parseInt(process.env.EMAIL_PORT, 10), // Example: 587
    // secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587/25
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASS,
    // },

    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: 'hikmatbk101@gmail.com',
      pass: 'bdwv lmcm gyud zkyb', //bdwv lmcm gyud zkyb
    },
  });

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.transporter.sendMail({
        from: `"Your App Name" <${process.env.EMAIL_USER}>`, // Custom sender name
        to,
        subject,
        text,
        html,
      });
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, message: error.message };
    }
  }
}
