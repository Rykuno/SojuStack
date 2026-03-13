import { Injectable } from '@nestjs/common';
import { MailConfig } from 'src/common/config/mail.config';
import { MailTransport, type MailMessage } from './mail.transport';

@Injectable()
export class ResendTransport implements MailTransport {
  constructor(private readonly mailConfig: MailConfig) {}

  async send({ to, subject, html, text }: MailMessage) {
    if (!this.mailConfig.resendApiKey) {
      throw new Error('RESEND_API_KEY is required when MAIL_PROVIDER is set to resend.');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.mailConfig.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${this.mailConfig.fromName} <${this.mailConfig.fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend request failed with ${response.status} ${response.statusText}.`);
    }
  }
}
