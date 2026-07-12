import { Inject, Injectable } from '@nestjs/common';
import { MailTransport, type MailMessage } from './mail.transport';
import { type ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MailConfig } from 'src/common/config';
@Injectable()
export class MailpitTransport implements MailTransport {
  constructor(
    @Inject(MailConfig.KEY)
    private readonly mailConfig: ConfigType<typeof MailConfig>,
    private readonly httpService: HttpService,
  ) {}

  async send({ to, subject, html, text }: MailMessage) {
    const mailpitUrl = this.mailConfig.mailpit.url;

    await firstValueFrom(
      this.httpService.post(`${mailpitUrl}/api/v1/send`, {
        Attachments: [],
        From: {
          Email: `noreply@${this.mailConfig.domain}`,
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
