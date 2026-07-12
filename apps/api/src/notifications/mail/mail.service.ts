import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { NotificationQueue } from 'src/queues/enums/queue.enum';
import { Queue } from 'bullmq';
import { MailProcess } from './enums/mail.enums';
import { SendEmailPayload } from './interfaces/mail.interface';
import ChangeEmailVerification, {
  ChangeEmailVerificationProps,
} from './templates/change-email-verification';
import EmailVerification, { EmailVerificationProps } from './templates/email-verification';
import { render } from '@react-email/components';
import PasswordReset, { PasswordResetProps } from './templates/password-reset';
import SignInOtp, { SignInOtpProps } from './templates/sign-in-otp';

export type MailInput<TemplateProps> = {
  to: string;
  props: TemplateProps;
};

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(NotificationQueue.email)
    private readonly emailQueue: Queue<SendEmailPayload, void, MailProcess.send>,
  ) {}

  async sendChangeEmailVerification({ to, props }: MailInput<ChangeEmailVerificationProps>) {
    return this.queueEmailJob({
      to,
      subject: 'Email change verification',
      html: await render(ChangeEmailVerification(props)),
    });
  }

  async sendVerificationEmail({ to, props }: MailInput<EmailVerificationProps>) {
    const html = await render(EmailVerification(props));
    return this.queueEmailJob({
      to,
      subject: 'Verify your email',
      html,
    });
  }

  async sendPasswordResetEmail({ to, props }: MailInput<PasswordResetProps>) {
    const html = await render(PasswordReset(props));
    return this.queueEmailJob({
      to,
      subject: 'Password reset',
      html,
    });
  }

  async sendSignInOtp({ to, props }: MailInput<SignInOtpProps>) {
    return this.queueEmailJob({
      to,
      subject: 'Sign in verification code',
      html: await render(SignInOtp(props)),
    });
  }

  private queueEmailJob(payload: SendEmailPayload) {
    return this.emailQueue.add(MailProcess.send, payload);
  }
}
