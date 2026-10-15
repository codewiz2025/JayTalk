import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/bucks")({
  component: () => <Navigate to="/wallet" />,
});
