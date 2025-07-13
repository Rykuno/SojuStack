import { queryOptions } from "@tanstack/react-query";
import { $api, fetchClient } from "~/lib/api";
import { authClient } from "~/lib/auth";

export type SignInEmail = {
  email: string;
  password: string;
};

export type SignUpEmail = {
  name: string;
  email: string;
  password: string;
};

export type UpdateProfileData = {
  name: string;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export type ChangeEmailData = {
  newEmail: string;
  password: string;
};

export class AuthAPI {
  queryKey = "auth";

  sessionQuery() {
    return queryOptions({
      queryKey: [this.queryKey, "session"],
      queryFn: () =>
        fetchClient()
          .GET("/auth/session")
          .then(res => res.data)
    });
  }

  signInEmail(data: SignInEmail) {
    return authClient.signIn.email(data);
  }

  signUpEmail(data: SignUpEmail) {
    return authClient.signUp.email(data);
  }

  logout() {
    return authClient.signOut();
  }

  updateProfile(data: UpdateProfileData) {
    return authClient.updateUser({ name: data.name });
  }

  changePassword(data: ChangePasswordData) {
    return authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
  }

  changeEmail(data: ChangeEmailData) {
    return authClient.changeEmail({
      newEmail: data.newEmail,
      callbackURL: `${import.meta.env.VITE_WEB_URL}/settings`
    });
  }

  sendVerificationEmail(currentEmail: string) {
    return authClient.sendVerificationEmail({
      email: currentEmail
    });
  }
}

export const authApi = new AuthAPI();
