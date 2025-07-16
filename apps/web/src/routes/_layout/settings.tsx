import { createFileRoute, redirect } from "@tanstack/react-router";
import { authApi } from "~/utils/auth";
import { UpdateProfileForm } from "~/components/update-profile-form";
import { UpdateEmailForm } from "~/components/update-email-form";
import { ResetPasswordForm } from "~/components/reset-password-form";
import { usersApi } from "~/utils/users";

export const Route = createFileRoute("/_layout/settings")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const authedUser = await context.queryClient.fetchQuery(authApi.meQuery());

    if (!authedUser) throw redirect({ to: "/login" });
    return { authedUser };
  }
});

function RouteComponent() {
  const { authedUser } = Route.useLoaderData();

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <UpdateProfileForm
        currentName={authedUser.name}
        currentImage={
          authedUser.image ||
          usersApi.getDefaultAvatar(authedUser.id).toDataUri()
        }
      />
      <UpdateEmailForm
        currentEmail={authedUser.email}
        emailVerified={authedUser.emailVerified}
      />
      <ResetPasswordForm />
    </div>
  );
}
