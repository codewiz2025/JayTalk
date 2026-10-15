import { createFileRoute } from "@tanstack/react-router";
import { SocialFeed } from "@/components/feed";

export const Route = createFileRoute("/_app/fyp")({
  component: () => <SocialFeed kind="video" />,
  head: () => ({ meta: [{ title: "For you — JayTalk" }] }),
});
