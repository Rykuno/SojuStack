import { MailInput } from 'src/mail/mail.service';
import type { SignInOtpProps } from '../mail/templates/sign-in-otp.email';

export const APP_QUEUE_NAME = 'jobs';

export const QUEUE_JOB_NAMES = {
  mailSendSignInOtp: 'mail.sendSignInOtp',
} as const;

export type QueueJobName = (typeof QUEUE_JOB_NAMES)[keyof typeof QUEUE_JOB_NAMES];

export type QueueJobPayloads = {
  [QUEUE_JOB_NAMES.mailSendSignInOtp]: MailInput<SignInOtpProps>;
};
