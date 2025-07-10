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
  Tailwind,
  Text
} from "@react-email/components";

export interface EmailVerificationProps {
  userEmail?: string;
  verificationUrl?: string;
  expirationHours?: number;
}

const EmailVerification = (props: EmailVerificationProps) => {
  const {
    userEmail = "me@rykuno.com",
    verificationUrl = "https://example.com/verify",
    expirationHours = 24
  } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Verify your email address to complete your account setup
        </Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] p-[32px] mx-auto max-w-[600px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[24px] font-bold text-gray-900 m-0 mb-[8px]">
                Verify Your Email Address
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Please confirm your email address to activate your account
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                Thanks for signing up! We need to verify your email address{" "}
                <strong>{userEmail}</strong> to complete your account setup.
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[24px] m-0">
                Click the button below to verify your email address:
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={verificationUrl}
                className="bg-blue-600 text-white px-[24px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border"
              >
                Verify Email Address
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                If the button doesn't work, you can also copy and paste this
                link into your browser:
              </Text>
              <Link
                href={verificationUrl}
                className="text-blue-600 text-[14px] break-all"
              >
                {verificationUrl}
              </Link>
            </Section>

            {/* Security Notice */}
            <Section className="mb-[32px] p-[16px] bg-gray-50 rounded-[6px]">
              <Text className="text-[14px] text-gray-600 m-0 mb-[8px]">
                <strong>Security Notice:</strong>
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                This verification link will expire in {expirationHours} hours.
                If you didn't create an account, you can safely ignore this
                email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailVerification.PreviewProps = {
  userEmail: "me@rykuno.com",
  verificationUrl: "https://example.com/verify?token=abc123xyz789",
  expirationHours: 24
} as EmailVerificationProps;

export default EmailVerification;
