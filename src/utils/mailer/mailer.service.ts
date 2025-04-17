
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly fromEmail: string;
  private readonly adminEmail: string;

  constructor(private readonly cfg: ConfigService) {
    const apiKey    = cfg.get<string>('SENDGRID_API_KEY');
    this.fromEmail  = cfg.get<string>('FROM_EMAIL')   ?? '';
    this.adminEmail = cfg.get<string>('ADMIN_EMAIL')  ?? '';

    if (!apiKey)    throw new Error('SENDGRID_API_KEY not set in .env');
    if (!this.fromEmail)  throw new Error('FROM_EMAIL not set in .env');
    if (!this.adminEmail) throw new Error('ADMIN_EMAIL not set in .env');

    sgMail.setApiKey(apiKey);
  }

  async sendWelcomeEmail(name: string, email: string) {
    const msg = {
      to:      email,
      from:    this.fromEmail,
      subject: 'Welcome to Our Platform!',
      text: `
Hi ${name},

Thank you for joining us! We’re excited to have you on board.

Next Steps:
1. Check your inbox for an OTP to verify your email.
2. Enter the OTP on the site within 10 minutes.
3. Explore your dashboard and get started!

If you have any questions, just reply to this email—our support team is here to help.

Cheers,
The Team
      `,
      html: `
<p>Hi <strong>${name}</strong>,</p>
<p>Thank you for joining us! We’re excited to have you on board.</p>
<h4>Next Steps:</h4>
<ol>
  <li>Check your inbox for an OTP to verify your email.</li>
  <li>Enter the OTP on the site within <strong>10 minutes</strong>.</li>
  <li>Explore your dashboard and get started!</li>
</ol>
<p>If you have any questions, just reply to this email—our support team is here to help.</p>
<p>Cheers,<br>The Team</p>
      `,
    };
    await sgMail.send(msg);
  }

  async sendOtpEmail(email: string, otp: string) {
    const msg = {
      to:      email,
      from:    this.fromEmail,
      subject: '🔐 Your One‑Time Password (OTP)',
      text: `
Your One‑Time Password is: ${otp}

This code is valid for 10 minutes. Do not share it with anyone.

If you didn’t request this, please ignore this email.

Thank you,
The Security Team
      `,
      html: `
<p>Your One‑Time Password is:</p>
<h2 style="font-family:monospace;letter-spacing:4px;">${otp}</h2>
<p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
<p>If you didn’t request this, please ignore this email.</p>
<p>Thank you,<br>The Security Team</p>
      `,
    };
    await sgMail.send(msg);
  }

  async notifyAdmin(user: { name: string; email: string }) {
    const msg = {
      to:      this.adminEmail,
      from:    this.fromEmail,
      subject: '👤 New User Registered',
      text: `
Admin,

A new user has just signed up:

• Name : ${user.name}
• Email: ${user.email}
• Date : ${new Date().toLocaleString()}

Please review and activate their account if everything looks good.

Regards,
System Notification
      `,
      html: `
<p><strong>Admin,</strong></p>
<p>A new user has just signed up:</p>
<ul>
  <li><strong>Name</strong> : ${user.name}</li>
  <li><strong>Email</strong>: ${user.email}</li>
  <li><strong>Date</strong> : ${new Date().toLocaleString()}</li>
</ul>
<p>Please review and activate their account if everything looks good.</p>
<p>Regards,<br>System Notification</p>
      `,
    };
    await sgMail.send(msg);
  }
}