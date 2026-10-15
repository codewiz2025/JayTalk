import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/auth-screen";

export const Route = createFileRoute("/login")({
  component: AuthScreen,
  head: () => ({ meta: [{ title: "Sign in — JayTalk" }, { name: "description", content: "Sign in or create your JayTalk account." }] }),
});
