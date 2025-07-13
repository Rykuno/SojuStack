import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "~/components/sign-up-form";

export const Route = createFileRoute("/signup")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <SignUpForm className="flex h-screen w-screen items-center justify-center" />
  );
}
