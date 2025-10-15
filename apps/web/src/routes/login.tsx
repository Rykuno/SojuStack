import { createFileRoute } from "@tanstack/react-router";
import Container from "~/components/container";
import { LoginForm } from "~/components/login-form";

export const Route = createFileRoute("/login")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <Container className="max-w-lg mx-auto mt-[10%]">
      <LoginForm />
    </Container>
  );
}
