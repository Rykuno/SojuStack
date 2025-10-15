import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

export interface ChangeEmailVerificationProps {
  newEmail: string;
  verificationUrl: string;
}

const ChangeEmailVerification = (props: ChangeEmailVerificationProps) => {
  const { newEmail = 'new@example.com', verificationUrl = '#' } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Verify your new email address</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[32px] max-w-[600px] mx-auto">
            <Section>
              <Heading className="text-[24px] font-bold text-gray-900 mb-[24px] mt-0">
                Verify Your New Email Address
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[16px] mt-0">
                You've requested to change your email address to:
              </Text>

              <Text className="text-[16px] font-semibold text-blue-600 mb-[24px] mt-0">
                {newEmail}
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[32px] mt-0">
                To complete this change, please click the button below to verify
                your new email address:
              </Text>

              <Button
                href={verificationUrl}
                className="bg-blue-600 text-white px-[24px] py-[12px] rounded-[6px] text-[16px] font-medium box-border"
              >
                Verify New Email
              </Button>

              <Text className="text-[14px] text-gray-600 mb-[16px] mt-[32px]">
                If you didn't request this change, please ignore this email or
                contact our support team.
              </Text>

              <Text className="text-[14px] text-gray-600 mb-0 mt-0">
                This verification link will expire in 24 hours.
              </Text>
            </Section>

            <Section className="mt-[48px] pt-[24px] border-t border-solid border-gray-200">
              <Text className="text-[12px] text-gray-500 mb-[8px] mt-0">
                Best regards,
                <br />
                The Support Team
              </Text>

              <Text className="text-[12px] text-gray-400 m-0">
                © 2024 Company Name. All rights reserved.
                <br />
                123 Business Street, City, State 12345
              </Text>

              <Text className="text-[12px] text-gray-400 m-0 mt-[8px]">
                <Link href="#" className="text-gray-400 underline">
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ChangeEmailVerification.PreviewProps = {
  newEmail: 'test@test.com',
  verificationUrl: 'https://example.com/verify-email?token=abc123',
} as ChangeEmailVerificationProps;

export default ChangeEmailVerification;
