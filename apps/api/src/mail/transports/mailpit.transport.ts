import { Injectable, Logger } from '@nestjs/common';
import { MailTransport, type MailMessage } from './mail.transport';
import { EnvService } from 'src/common/env/env.service';

@Injectable()
export class MailpitTransport implements MailTransport {
  private readonly logger = new Logger(MailpitTransport.name);

  constructor(private readonly envService: EnvService) {}

  async send({ to, subject, html, text }: MailMessage) {
    const mailpitUrl = this.envService.mail.mailpit.url;
    const response = await fetch(`${mailpitUrl}/api/v1/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Attachments: [],
        From: {
          Email: `${this.envService.mail.domain} <${this.envService.mail.domain}>`,
          Name: this.envService.app.name,
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
    this.logger.log(`${mailpitUrl}/view/${data.ID}`);
  }
}
