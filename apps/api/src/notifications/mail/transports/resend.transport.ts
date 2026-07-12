import { Injectable } from '@nestjs/common';
import { MailTransport, type MailMessage } from './mail.transport';

@Injectable()
export class ResendTransport implements MailTransport {
  constructor() {}

  async send(_msg: MailMessage) {}
}
