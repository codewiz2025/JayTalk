# JayTalk

## Run locally

```bash
bun install   # or npm install
# Fill in .env (see .env.example)
bun run dev
```

## Required environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Supabase Postgres connection string (Settings → Database → URI). Auth stays Better Auth — do not use Supabase Auth. |
| `RESEND_API_KEY` | Resend API key for confirmation and reset emails. |
| `RESEND_FROM` | `JayTalk <noreply@jaytech.online>` (verified domain: www.jaytech.online). |

Without `DATABASE_URL` the app falls back to a temporary PGLite database that does not persist.

## Email

Sign-up and forgot-password codes are emailed via Resend and are not shown on screen. Codes expire in 15 minutes.

## Buy Bucks

Packs (final placeholders until you change them):
- 1,000 Bucks = ₦100
- 5,000 Bucks = ₦500
- 10,000 Bucks = ₦1,000
- 50,000 Bucks = ₦5,000

Payment is manual via WhatsApp 08164584620. An admin credits the Bucks after payment.
