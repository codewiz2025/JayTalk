import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/calls")({
  component: () => <Navigate to="/chat" />,
});
