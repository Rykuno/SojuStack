import { Injectable } from '@nestjs/common';
import { MailTransport, type MailMessage } from './mail.transport';
import { EnvService } from 'src/common/env/env.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MailpitTransport implements MailTransport {
  constructor(
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {}

  async send({ to, subject, html, text }: MailMessage) {
    const mailpitUrl = this.envService.mail.mailpit.url;
    this.httpService.post(`${mailpitUrl}/api/v1/send`, {
      data: {
        Attachments: [],
        From: {
          Email: `${this.envService.mail.domain} <${this.envService.mail.domain}>`,
          Name: this.envService.app.name,
        },
        HTML: html,
        Subject: subject,
        Text: text,
        To: [{ Email: to, Name: to }],
      },
    });
  }
}
