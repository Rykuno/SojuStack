import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "~/components/login-form";

export const Route = createFileRoute("/login")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <LoginForm className="flex h-screen w-screen items-center justify-center" />
  );
}
