import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
  outline: "border border-border bg-card hover:bg-muted",
  ghost: "hover:bg-muted",
  danger: "bg-destructive text-white hover:opacity-90",
} as const;

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "min-h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none ring-ring focus:ring-2",
        props.className,
      )}
    />
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
      {hint && <span className="block text-xs font-normal text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Avatar({
  photo,
  emoji,
  className,
}: {
  photo?: string | null;
  emoji?: string | null;
  className?: string;
}) {
  if (photo) return <img src={photo} alt="" className={cn("rounded-full object-cover", className)} />;
  return (
    <span className={cn("grid place-items-center rounded-full bg-secondary text-lg", className)}>
      {emoji || "🙂"}
    </span>
  );
}

export function errText(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Try again.";
}
