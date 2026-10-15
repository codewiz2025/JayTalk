import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Outlet, createRootRoute, Scripts } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppErrorComponent } from "@/lib/error-component";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  shellComponent: RootShell,
  component: RootComponent,
  errorComponent: AppErrorComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>JayTalk</title>
        <meta name="description" content="JayTalk — connect, share and talk." />
        <meta name="theme-color" content="#2F6BFF" />
        <link rel="stylesheet" href={appCss} />
        <link rel="icon" type="image/png" href="/brand/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/brand/jaytalk-icon-192.png" />
        <link rel="manifest" href="/__grok/manifest.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&display=swap" />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreviewHostBridge />
        <Outlet />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function NotFound() {
  const links = [
    ["/", "Home"],
    ["/login", "Sign in"],
    ["/chat", "Chat"],
    ["/friends", "Friends"],
    ["/groups", "Groups"],
    ["/fyp", "For you"],
    ["/moods", "Moods"],
    ["/games", "Games"],
    ["/challenges", "Challenges"],
    ["/store", "Store"],
    ["/wallet", "Bucks"],
    ["/profile", "Profile"],
  ] as const;
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <img src="/brand/jaytalk-icon-192.png" alt="" className="size-14 rounded-2xl" />
      <h1 className="mt-6 text-4xl font-extrabold">That page isn't on JayTalk</h1>
      <p className="mt-2 text-sm text-muted-foreground">Try one of these instead.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {links.map(([to, label]) => (
          <Link key={to} to={to} className="rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground">
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
