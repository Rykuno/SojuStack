import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: Home
});

function Home() {
  // log the current url
  return (
    <div className="p-2 container mx-auto">
      <h3>Welcome Home!!!</h3>
    </div>
  );
}
