import { Injectable } from '@nestjs/common';
import { MailTransport, type MailMessage } from './mail.transport';
import { EnvService } from 'src/common/env/env.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class MailpitTransport implements MailTransport {
  constructor(
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {}

  async send({ to, subject, html, text }: MailMessage) {
    const mailpitUrl = this.envService.mail.mailpit.url;

    await firstValueFrom(
      this.httpService.post(`${mailpitUrl}/api/v1/send`, {
        Attachments: [],
        From: {
          Email: `noreply@${this.envService.mail.domain}`,
          Name: 'SojuStack',
        },
        HTML: html,
        Subject: subject,
        Text: text,
        To: [{ Email: to, Name: to }],
      }),
    );
  }
}
