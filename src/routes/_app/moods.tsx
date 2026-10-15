import { createFileRoute } from "@tanstack/react-router";
import { SocialFeed } from "@/components/feed";

export const Route = createFileRoute("/_app/moods")({
  component: () => <SocialFeed kind="mood" />,
  head: () => ({ meta: [{ title: "Moods — JayTalk" }] }),
});
