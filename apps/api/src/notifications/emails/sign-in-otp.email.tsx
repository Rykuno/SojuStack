import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import { secondsToMinutes } from 'date-fns';

export interface SignInOtpProps {
  otpCode: string;
  expiresInSeconds: number;
}

const SignInOtp = (props: SignInOtpProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Your sign-in verification code: {props.otpCode}</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white mx-auto px-[40px] py-[40px] max-w-[600px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-black text-[24px] font-bold m-0 mb-[8px]">
                Sign-in Verification
              </Heading>
              <Text className="text-gray-600 text-[14px] m-0">
                Complete your sign-in process
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-black text-[16px] mb-[16px] leading-[24px]">
                Hello,
              </Text>
              <Text className="text-black text-[16px] mb-[24px] leading-[24px]">
                We received a request to sign in to your account. Use the
                verification code below to complete your sign-in:
              </Text>

              {/* OTP Code */}
              <Section className="text-center bg-gray-50 py-[24px] px-[16px] mb-[24px] border border-solid border-gray-200">
                <Text className="text-black text-[32px] font-bold tracking-[8px] m-0 font-mono">
                  {props.otpCode}
                </Text>
              </Section>

              <Text className="text-black text-[16px] mb-[16px] leading-[24px]">
                This code will expire in{' '}
                <strong>
                  {secondsToMinutes(props.expiresInSeconds)} minutes
                </strong>{' '}
                for your security.
              </Text>
              <Text className="text-black text-[16px] mb-[24px] leading-[24px]">
                If you didn't request this code, please ignore this email or
                contact our support team if you have concerns.
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="border-t border-solid border-gray-200 pt-[24px] mb-[32px]">
              <Text className="text-gray-600 text-[14px] mb-[8px] leading-[20px]">
                <strong>Security tip:</strong> Never share this code with
                anyone. We will never ask for your verification code via phone
                or email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-gray-200 pt-[24px]">
              <Text className="text-gray-500 text-[12px] leading-[16px] m-0 mb-[8px]">
                © 2024 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-gray-500 text-[12px] leading-[16px] m-0">
                123 Business Street, Suite 100, Frisco, TX 75034
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

SignInOtp.PreviewProps = {
  otpCode: '123456',
};

export default SignInOtp;
