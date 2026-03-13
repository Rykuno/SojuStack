import { Injectable, Logger } from '@nestjs/common';
import { MailConfig } from 'src/common/config/mail.config';
import { MailTransport, type MailMessage } from './mail.transport';

@Injectable()
export class MailpitTransport implements MailTransport {
  private readonly logger = new Logger(MailpitTransport.name);

  constructor(private readonly mailConfig: MailConfig) {}

  async send({ to, subject, html, text }: MailMessage) {
    const response = await fetch(`${this.mailConfig.mailpitUrl}/api/v1/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Attachments: [],
        From: {
          Email: this.mailConfig.fromEmail,
          Name: this.mailConfig.fromName,
        },
        HTML: html,
        Subject: subject,
        Text: text,
        To: [{ Email: to, Name: to }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Mailpit request failed with ${response.status} ${response.statusText}.`);
    }

    const data = (await response.json()) as { ID: string };
    this.logger.log(`${this.mailConfig.mailpitUrl}/view/${data.ID}`);
  }
}
