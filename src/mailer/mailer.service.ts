
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly SENDGRID_API_KEY = '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'; // Replace with your SendGrid API key
  
  constructor() {
    sgMail.setApiKey(this.SENDGRID_API_KEY);
  }

  // Send welcome email to the user
  async sendWelcomeEmail(name: string, email: string) {
    const msg = {
      to: email,
      from: 'shruti.shukla@systango.com', // Adjust your "from" email
      subject: 'Welcome to Our Platform',
      text: `Hello ${name}, welcome to our platform!`,
    };

    await sgMail.send(msg);
  }

  // Notify the admin with user details
  async notifyAdmin(newUser: { name: string; email: string }) {
    const { name, email } = newUser; // Destructure name and email from the passed object

    const msg = {
      to: 'mishrarishikaa@gmail.com', // Admin email
      from: 'shruti.shukla@systango.com', // Adjust your "from" email
      subject: 'New User Registered',
      text: `A new user has registered:\nName: ${name}\nEmail: ${email}`,
    };

    await sgMail.send(msg);
  }
}