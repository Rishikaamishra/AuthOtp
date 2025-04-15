import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.ENDGRID_API_KEY!);
  }

  async sendWelcomeEmail(email: string) {
    await sgMail.send({
      to: email,
      from: process.env.ADMIN_EMAIL!,
      subject: 'Welcome!',
      text: 'Thank you for registering with us.',
    });
  }

  async notifyAdmin(userEmail: string) {
    await sgMail.send({
      to: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL!,
      subject: 'New User Registered',
      text: `A new user registered with email: ${userEmail}`,
    });
  }
}
