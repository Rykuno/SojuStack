import { Inject, Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import ChangeEmailVerification, {
  type ChangeEmailVerificationProps,
} from './templates/change-email-verification';
import EmailVerification, { type EmailVerificationProps } from './templates/email-verification';
import PasswordReset, { type PasswordResetProps } from './templates/password-reset';
import SignInOtp, { type SignInOtpProps } from './templates/sign-in-otp.email';
import { MAIL_TRANSPORT, MailTransport } from './transports/mail.transport';

export type MailInput<TemplateProps> = {
  to: string;
  props: TemplateProps;
};

@Injectable()
export class MailService {
  constructor(@Inject(MAIL_TRANSPORT) private readonly mailTransport: MailTransport) {}

  sendChangeEmailVerification({ to, props }: MailInput<ChangeEmailVerificationProps>) {
    return this.sendTemplate({
      to,
      subject: 'Email change verification',
      template: ChangeEmailVerification(props),
    });
  }

  sendVerificationEmail({ to, props }: MailInput<EmailVerificationProps>) {
    return this.sendTemplate({
      to,
      subject: 'Verify your email',
      template: EmailVerification(props),
    });
  }

  sendPasswordResetEmail({ to, props }: MailInput<PasswordResetProps>) {
    return this.sendTemplate({
      to,
      subject: 'Password reset',
      template: PasswordReset(props),
    });
  }

  sendSignInOtp({ to, props }: MailInput<SignInOtpProps>) {
    return this.sendTemplate({
      to,
      subject: 'Sign in verification code',
      template: SignInOtp(props),
    });
  }

  private async sendTemplate({
    to,
    subject,
    template,
  }: {
    to: string;
    subject: string;
    template: React.ReactNode;
  }) {
    const html = await render(template);

    await this.mailTransport.send({
      to,
      subject,
      html,
      text: html,
    });
  }
}
