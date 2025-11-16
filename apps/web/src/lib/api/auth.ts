import { queryOptions } from "@tanstack/react-query";
import { $authClient } from "../auth-client";

export class AuthApi {
  private readonly queryKeys = ["auth"];
  constructor() {}

  getSession() {
    return queryOptions({
      queryKey: [...this.queryKeys, "session"],
      queryFn: () => $authClient.getSession()
    });
  }

  signOut() {
    return $authClient.signOut();
  }

  sendSignInOtp(email: string) {
    return $authClient.emailOtp.sendVerificationOtp({
      email: email,
      type: "sign-in"
    });
  }

  verifySignInOtp(email: string, code: string) {
    return $authClient.signIn.emailOtp({
      email: email,
      otp: code
    });
  }
}
