export const MAIL_TRANSPORT = Symbol('MAIL_TRANSPORT');

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export abstract class MailTransport {
  abstract send(message: MailMessage): Promise<void>;
}
