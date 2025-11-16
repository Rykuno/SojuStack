import { LoginForm } from "@/components/login-form";
import { OTPForm } from "@/components/otp-form";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  loader: async ({ context }) => {
    if (context.user) throw redirect({ to: "/" });
  },
  component: RouteComponent
});

function RouteComponent() {
  const [validateEmailOtp, setValidateEmailOtp] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="flex items-center justify-center h-screen">
      {validateEmailOtp ? (
        <OTPForm email={validateEmailOtp} />
      ) : (
        <LoginForm setValidateEmailOtp={setValidateEmailOtp} />
      )}
    </div>
  );
}
