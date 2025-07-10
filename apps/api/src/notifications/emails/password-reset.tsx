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
	Text,
} from "@react-email/components";
import * as React from "react";

export interface PasswordResetProps {
	userEmail?: string;
	resetUrl?: string;
	expirationHours?: number;
	requestTime?: string;
}

const PasswordReset = (props: PasswordResetProps) => {
	const {
		userEmail = "me@rykuno.com",
		resetUrl = "https://example.com/reset-password",
		expirationHours = 1,
		requestTime = "December 23, 2025 at 2:10 PM CST",
	} = props;

	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>Reset your password - action required</Preview>
				<Body className="bg-gray-100 font-sans py-[40px]">
					<Container className="bg-white rounded-[8px] p-[32px] mx-auto max-w-[600px]">
						{/* Header */}
						<Section className="text-center mb-[32px]">
							<Heading className="text-[24px] font-bold text-gray-900 m-0 mb-[8px]">
								Reset Your Password
							</Heading>
							<Text className="text-[16px] text-gray-600 m-0">
								We received a request to reset your password
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="mb-[32px]">
							<Text className="text-[16px] text-gray-700 mb-[16px] m-0">
								We received a request to reset the password for your account
								associated with <strong>{userEmail}</strong>.
							</Text>
							<Text className="text-[16px] text-gray-700 mb-[24px] m-0">
								Click the button below to create a new password:
							</Text>
						</Section>

						{/* CTA Button */}
						<Section className="text-center mb-[32px]">
							<Button
								href={resetUrl}
								className="bg-red-600 text-white px-[24px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border"
							>
								Reset Password
							</Button>
						</Section>

						{/* Alternative Link */}
						<Section className="mb-[32px]">
							<Text className="text-[14px] text-gray-600 mb-[8px] m-0">
								If the button doesn't work, you can also copy and paste this
								link into your browser:
							</Text>
							<Link
								href={resetUrl}
								className="text-red-600 text-[14px] break-all"
							>
								{resetUrl}
							</Link>
						</Section>

						{/* Security Notice */}
						<Section className="mb-[32px] p-[16px] bg-red-50 border border-red-200 rounded-[6px]">
							<Text className="text-[14px] text-red-700 m-0 mb-[8px]">
								<strong>Important Security Information:</strong>
							</Text>
							<Text className="text-[14px] text-red-600 m-0 mb-[8px]">
								This password reset link will expire in {expirationHours} hour
								{expirationHours !== 1 ? "s" : ""}.
							</Text>
							<Text className="text-[14px] text-red-600 m-0">
								If you didn't request this password reset, please ignore this
								email or contact our support team immediately. Your account
								remains secure.
							</Text>
						</Section>

						{/* Additional Help */}
						<Section className="mb-[32px]">
							<Text className="text-[14px] text-gray-600 m-0 mb-[8px]">
								Need help? Here are some tips for creating a strong password:
							</Text>
							<Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
								• Use at least 8 characters
							</Text>
							<Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
								• Include uppercase and lowercase letters
							</Text>
							<Text className="text-[14px] text-gray-600 m-0 mb-[4px]">
								• Add numbers and special characters
							</Text>
							<Text className="text-[14px] text-gray-600 m-0">
								• Avoid using personal information
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

PasswordReset.PreviewProps = {
	userEmail: "me@rykuno.com",
	resetUrl: "https://example.com/reset-password?token=abc123xyz789",
	expirationHours: 1,
	requestTime: "December 23, 2025 at 2:10 PM CST",
	userLocation: "McKinney, TX",
} as PasswordResetProps;

export default PasswordReset;
