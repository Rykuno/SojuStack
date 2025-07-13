import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavMenu } from "~/components/nav-menu";
import { Separator } from "~/components/ui/separator";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div>
      <NavMenu />
      <Separator />
      <Outlet />
    </div>
  );
}
