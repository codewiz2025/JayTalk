import { env } from "@/lib/env.server";

const FROM = env("RESEND_FROM") || "JayTalk <noreply@jaytech.online>";

export async function sendCodeEmail(
  to: string,
  purpose: "signup" | "reset",
  code: string,
) {
  const key = env("RESEND_API_KEY");
  if (!key) {
    throw new Error("Email is not configured. Add RESEND_API_KEY.");
  }

  const subject =
    purpose === "signup"
      ? "Your JayTalk confirmation code"
      : "Your JayTalk reset code";

  const heading =
    purpose === "signup"
      ? "Confirm your JayTalk account"
      : "Reset your JayTalk password";

  const body =
    purpose === "signup"
      ? "Enter this code to finish creating your JayTalk account. It expires in 15 minutes."
      : "Enter this code to set a new password. It expires in 15 minutes.";

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h1 style="font-size:22px;margin:0 0 12px">JayTalk</h1>
      <p style="margin:0 0 8px;font-weight:600">${heading}</p>
      <p style="margin:0 0 16px;color:#555">${body}</p>
      <p style="font-size:32px;font-weight:800;letter-spacing:8px;margin:0 0 16px">${code}</p>
      <p style="margin:0;color:#888;font-size:12px">If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Couldn't send the email${text ? `: ${text.slice(0, 180)}` : "."}`,
    );
  }
}