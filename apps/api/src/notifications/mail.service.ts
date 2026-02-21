import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { render } from '@react-email/render';
import ChangeEmailVerification, {
  ChangeEmailVerificationProps,
} from './emails/change-email-verification';
import PasswordReset, { PasswordResetProps } from './emails/password-reset';
import EmailVerification, { EmailVerificationProps } from './emails/email-verification';
import { MailConfig } from 'src/common/config/mail.config';
import { AppConfig } from 'src/common/config/app.config';
import SignInOtp, { SignInOtpProps } from './emails/sign-in-otp.email';

interface SendMailConfiguration {
  email: string;
  subject: string;
  template: React.ReactNode;
}

interface Email<T> {
  to: string;
  props: T;
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailConfig: MailConfig,
    private readonly appConfig: AppConfig,
  ) {}

  onModuleInit() {
    if (this.appConfig.isProduction) {
      throw new Error('Production email provider is not configured.');
    }
  }

  private send({ email, subject, template }: SendMailConfiguration) {
    return this.appConfig.isProduction
      ? this.sendProd({ email, subject, template })
      : this.sendDev({ email, subject, template });
  }

  private async sendProd(_props: SendMailConfiguration) {
    throw new Error('Production email provider is not configured.');
  }

  private async sendDev({ email, subject, template }: SendMailConfiguration) {
    const html = await render(template);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Attachments: [],
        From: {
          Email: `noreply@${this.mailConfig.domain}`,
          Name: 'SojuStack',
        },
        HTML: html,
        Subject: subject,
        Text: html,
        To: [{ Email: email, Name: email }],
      }),
    };

    const response = await fetch(`${this.mailConfig.mailpitUrl}/api/v1/send`, options);

    if (!response.ok) {
      throw new Error(`Mailpit request failed with ${response.status} ${response.statusText}.`);
    }

    const data = (await response.json()) as { ID: string };
    this.logger.log(`${this.mailConfig.mailpitUrl}/view/${data.ID}`);
  }

  sendVerificationEmail({ to, props }: Email<EmailVerificationProps>) {
    return this.send({
      email: to,
      subject: 'Verify your email',
      template: EmailVerification(props),
    });
  }

  sendSignInOtpEmail({ to, props }: Email<SignInOtpProps>) {
    return this.send({
      email: to,
      subject: 'Sign in verification code',
      template: SignInOtp(props),
    });
  }

  sendPasswordResetEmail({ to, props }: Email<PasswordResetProps>) {
    return this.send({
      email: to,
      subject: 'Password reset',
      template: PasswordReset(props),
    });
  }

  sendChangeEmailVerificationEmail({ to, props }: Email<ChangeEmailVerificationProps>) {
    return this.send({
      email: to,
      subject: 'Email change verification',
      template: ChangeEmailVerification(props),
    });
  }
}
