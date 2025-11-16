import { Container } from "@/components/container";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  loader: ({ context }) => {
    return {
      user: context.user
    };
  }
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return (
    <>
      <Container className="">
        <Navbar user={user} />
      </Container>
      <Separator />
      <Container className="border-r border-l py-4">
        <Outlet />
      </Container>
    </>
  );
}
