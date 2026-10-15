import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";
import {
  checkUsername,
  finishSignup,
  requestResetCode,
  requestSignupCode,
  resetPassword,
  resolveUsernameForLogin,
} from "@/lib/jaytalk-api";
import { usernameOk } from "@/lib/jaytalk";
import { Brand, ThemeButton } from "@/components/shell";
import { Button, Field, Input, errText } from "@/components/ui";

type Mode = "in" | "up" | "code" | "forgot" | "reset";

export function AuthScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("in");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [nameHint, setNameHint] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    fullName: "",
    username: "",
  });

  useEffect(() => {
    if (mode !== "up") {
      setNameHint("");
      setSuggestions([]);
      return;
    }
    const username = form.username.trim();
    if (!username) {
      setNameHint("");
      setSuggestions([]);
      return;
    }
    if (!usernameOk(username)) {
      setNameHint("Use 3–20 letters, numbers, or underscores.");
      setSuggestions([]);
      return;
    }
    const timer = window.setTimeout(() => {
      void checkUsername({ data: { username } })
        .then((result) => {
          setNameHint(result.reason ?? "");
          setSuggestions(result.suggestions ?? []);
        })
        .catch((err) => {
          setNameHint(errText(err));
          setSuggestions([]);
        });
    }, 280);
    return () => window.clearTimeout(timer);
  }, [form.username, mode]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "in") {
        const username = form.username.trim().replace(/^@/, "");
        if (!username) throw new Error("Enter your username.");
        if (!form.password) throw new Error("Enter your password.");
        const resolved = await resolveUsernameForLogin({ data: { username } });
        if (!resolved?.email) {
          throw new Error("No account with that username.");
        }
        const result = await authClient.signIn.email({
          email: resolved.email,
          password: form.password,
        });
        if (result.error) throw new Error(result.error.message || "Username or password is wrong.");
        await navigate({ to: "/chat" });
      } else if (mode === "up") {
        if (form.password !== form.confirm) throw new Error("Passwords do not match.");
        if (!usernameOk(form.username.trim())) throw new Error("Choose a valid username.");
        await requestSignupCode({
          data: {
            email: form.email.trim().toLowerCase(),
            username: form.username.trim(),
            fullName: form.fullName.trim(),
          },
        });
        setCode("");
        setMode("code");
      } else if (mode === "code") {
        const email = form.email.trim().toLowerCase();
        const session = await authClient.getSession();
        if (!session.data?.user) {
          const created = await authClient.signUp.email({
            email,
            password: form.password,
            name: form.fullName.trim(),
          });
          if (created.error) {
            const message = created.error.message || "Couldn't create the account.";
            if (/exist/i.test(message)) {
              const signed = await authClient.signIn.email({ email, password: form.password });
              if (signed.error) throw new Error("An account with this email already exists. Sign in instead.");
            } else {
              throw new Error(message);
            }
          }
        }
        await finishSignup({ data: { code: code.trim() } });
        await navigate({ to: "/chat" });
      } else if (mode === "forgot") {
        const issued = await requestResetCode({ data: { email: form.email.trim().toLowerCase() } });
        if (!issued.found || !issued.sent) throw new Error("No JayTalk account uses that email.");
        setCode("");
        setForm((current) => ({ ...current, password: "", confirm: "" }));
        setMode("reset");
      } else {
        if (form.password !== form.confirm) throw new Error("Passwords do not match.");
        await resetPassword({
          data: {
            email: form.email.trim().toLowerCase(),
            code: code.trim(),
            password: form.password,
          },
        });
        setMode("in");
        setForm((current) => ({ ...current, password: "", confirm: "" }));
        setError("Password updated. Sign in with your username and new password.");
      }
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(false);
    }
  }

  const title =
    mode === "in"
      ? "Welcome back"
      : mode === "up"
        ? "Join JayTalk"
        : mode === "code"
          ? "Confirm your email"
          : mode === "forgot"
            ? "Reset password"
            : "Choose a new password";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Brand />
        <ThemeButton />
      </div>
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "in" && "Sign in with your username and password."}
        {mode === "up" && "Usernames are unique — we check as you type. Confirm email with a code."}
        {mode === "code" && "Enter the confirmation code we sent to your email."}
        {mode === "forgot" && "Enter the email on your account. We'll send a reset code."}
        {mode === "reset" && "Enter the code from your email and a new password."}
      </p>

      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        {mode === "in" && (
          <>
            <Field label="Username">
              <Input
                autoComplete="username"
                placeholder="yourname"
                value={form.username}
                onChange={(e) => set("username", e.target.value)}
                required
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
              />
            </Field>
          </>
        )}

        {mode === "up" && (
          <>
            <Field label="Full name">
              <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
            </Field>
            <Field label="Username">
              <Input
                autoComplete="username"
                placeholder="coolname"
                value={form.username}
                onChange={(e) => set("username", e.target.value)}
                required
              />
              {nameHint && (
                <p
                  className={`mt-1 text-xs ${
                    nameHint.includes("available") ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {nameHint}
                </p>
              )}
              {suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold hover:border-primary"
                      onClick={() => set("username", s)}
                    >
                      @{s}
                    </button>
                  ))}
                </div>
              )}
            </Field>
            <Field label="Email">
              <Input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
              />
            </Field>
            <Field label="Confirm password">
              <Input
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                required
              />
            </Field>
          </>
        )}

        {mode === "code" && (
          <Field label="Confirmation code">
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </Field>
        )}

        {mode === "forgot" && (
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </Field>
        )}

        {mode === "reset" && (
          <>
            <Field label="Reset code">
              <Input value={code} onChange={(e) => setCode(e.target.value)} required />
            </Field>
            <Field label="New password">
              <Input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
              />
            </Field>
            <Field label="Confirm password">
              <Input
                type="password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                required
              />
            </Field>
          </>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy
            ? "Please wait…"
            : mode === "in"
              ? "Sign in"
              : mode === "up"
                ? "Continue"
                : mode === "code"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send code"
                    : "Update password"}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {mode === "in" && (
          <>
            <Button type="button" variant="ghost" className="px-0" onClick={() => { setMode("up"); setError(""); }}>
              Create account
            </Button>
            <Button type="button" variant="ghost" className="px-0" onClick={() => { setMode("forgot"); setError(""); }}>
              Forgot password?
            </Button>
          </>
        )}
        {mode !== "in" && (
          <Button type="button" variant="ghost" className="px-0" onClick={() => { setMode("in"); setError(""); }}>
            Back to sign in
          </Button>
        )}
      </div>
    </main>
  );
}