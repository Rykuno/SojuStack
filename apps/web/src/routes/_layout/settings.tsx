import { createFileRoute, redirect } from "@tanstack/react-router";
import { authApi } from "~/utils/auth";
import { UpdateProfileForm } from "~/components/update-profile-form";
import { UpdateEmailForm } from "~/components/update-email-form";
import { ResetPasswordForm } from "~/components/reset-password-form";

export const Route = createFileRoute("/_layout/settings")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const session = await context.queryClient.fetchQuery(
      authApi.sessionQuery()
    );

    if (!session) throw redirect({ to: "/login" });
    return { session };
  }
});

function RouteComponent() {
  const { session } = Route.useLoaderData();

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <UpdateProfileForm currentName={session.name} />
      <UpdateEmailForm
        currentEmail={session.email}
        emailVerified={session.emailVerified}
      />
      <ResetPasswordForm />
    </div>
  );
}
