import { createFileRoute, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Shell, useMe } from "@/components/shell";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const me = useMe();

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Opening JayTalk…
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  if (me.isPending) {
    return (
      <div className="grid min-h-screen place-items-center gap-3 px-6 text-center">
        <p className="text-sm text-muted-foreground">Loading your profile…</p>
        <p className="text-xs text-muted-foreground">If this takes more than a few seconds, refresh the page.</p>
      </div>
    );
  }

  if (me.isError) {
    return (
      <main className="grid min-h-screen place-items-center gap-3 px-6 text-center">
        <p className="text-sm text-destructive">
          {me.error instanceof Error ? me.error.message : "Couldn't load your profile."}
        </p>
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          onClick={() => void me.refetch()}
        >
          Try again
        </button>
      </main>
    );
  }

  if (!me.data && pathname !== "/profile") return <Navigate to="/profile" />;

  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}