/**
 * Self-hosted Better Auth for THIS app (server-only).
 * Cloudflare-safe: Hyperdrive when available; no startup DB bootstrap.
 */
import { betterAuth } from "better-auth";
import { bearer, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getCookie } from "@tanstack/react-start/server";
import { Pool } from "pg";
import { getPglite } from "../db";
import { emailAndPasswordEnabled } from "./email-password";
import { GATE_PROVIDER_ID, gateIdentitySessions } from "./gate-session.server";
import { GROK_PROVIDERS } from "./providers";
import { pgliteDialect } from "./pglite-dialect";
import {
  GROK_ISSUER_DEFAULT,
  PREVIEW_ALLOWED_HOSTS,
  PREVIEW_CLIENT_ID,
  PREVIEW_CLIENT_SECRET,
} from "./preview";

const env = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

const authDisabled = env("VITE_AUTH_ENABLED") === "false";

const grokIssuer = env("GROK_AUTH_ISSUER") ?? GROK_ISSUER_DEFAULT;
const grokClientId = env("GROK_AUTH_CLIENT_ID") ?? PREVIEW_CLIENT_ID;
const grokClientSecret = env("GROK_AUTH_CLIENT_SECRET") ?? PREVIEW_CLIENT_SECRET;

export const authConfigured =
  !authDisabled && Boolean(grokClientId && grokClientSecret);

const explicitBaseURL = env("BETTER_AUTH_URL");
const previewAllowedHosts: string[] = [...PREVIEW_ALLOWED_HOSTS];

const LOCAL_DEV_ORIGINS: string[] = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://[::1]:8080",
];

const PRODUCTION_ORIGINS: string[] = [
  "https://jaytalk.mathplus.workers.dev",
  "https://chat.jaytech.online",
  "https://jaytalk.jaytech.online",
];

const baseURL = explicitBaseURL ?? {
  allowedHosts: [
    ...previewAllowedHosts,
    "localhost",
    "127.0.0.1",
    "[::1]",
    "jaytalk.mathplus.workers.dev",
    "chat.jaytech.online",
    "jaytalk.jaytech.online",
  ],
  protocol: "auto" as const,
  fallback: "https://jaytalk.mathplus.workers.dev",
};

const trustedOrigins: string[] = [
  ...(explicitBaseURL ? [explicitBaseURL] : []),
  ...PRODUCTION_ORIGINS,
  ...LOCAL_DEV_ORIGINS,
  ...previewAllowedHosts,
  ...previewAllowedHosts.flatMap((host) => [
    `https://${host}`,
    `http://${host}`,
  ]),
];

const databaseUrl = env("DATABASE_URL");

function resolvePgConnectionString(): string | undefined {
  try {
    const getBuiltin = (
      process as unknown as {
        getBuiltinModule?: (name: string) => unknown;
      }
    ).getBuiltinModule;
    if (typeof getBuiltin === "function") {
      const mod = getBuiltin("cloudflare:workers") as {
        env?: { HYPERDRIVE?: { connectionString?: string } };
      };
      const hd = mod?.env?.HYPERDRIVE?.connectionString;
      if (hd) return hd;
    }
  } catch {
    // local / non-Workers
  }
  return databaseUrl;
}

const pgUrl = resolvePgConnectionString();
const database = pgUrl
  ? new Pool({
      connectionString: pgUrl,
      max: 1,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 1_000,
      allowExitOnIdle: true,
    })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

const issuerBase = grokIssuer.replace(/\/+$/, "");
const grokAuthorizationUrl = `${issuerBase}/api/auth/oauth2/authorize`;
const grokTokenUrl = `${issuerBase}/api/auth/oauth2/token`;
const grokUserInfoUrl = `${issuerBase}/api/auth/oauth2/userinfo`;

export const SESSION_TOKEN_COOKIE = "__Host-grok-auth.session_token";

const grokOAuthPlugin = authConfigured
  ? genericOAuth({
      config: GROK_PROVIDERS.map(({ providerId, idp }) => ({
        providerId,
        clientId: grokClientId as string,
        clientSecret: grokClientSecret as string,
        authorizationUrl: grokAuthorizationUrl,
        tokenUrl: grokTokenUrl,
        userInfoUrl: grokUserInfoUrl,
        scopes: ["openid", "profile", "email"],
        authorizationUrlParams: { idp, prompt: "login" },
      })),
    })
  : null;

export const auth = betterAuth({
  baseURL,
  secret:
    env("BETTER_AUTH_SECRET") ??
    "JayTalkAuthSecret2026JayTechOnline-change-me",
  database,
  trustedOrigins,
  account: {
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      trustedProviders: [
        ...GROK_PROVIDERS.map((p) => p.providerId),
        GATE_PROVIDER_ID,
      ],
      requireLocalEmailVerified: false,
    },
  },
  session: { cookieCache: { enabled: true, maxAge: 300 } },
  ...(emailAndPasswordEnabled ? { emailAndPassword: { enabled: true } } : {}),
  advanced: {
    useSecureCookies: false,
    defaultCookieAttributes: { secure: true, sameSite: "lax", path: "/" },
    cookies: {
      session_token: { name: SESSION_TOKEN_COOKIE },
      session_data: { name: "__Host-grok-auth.session_data" },
      account_data: { name: "__Host-grok-auth.account_data" },
      dont_remember: { name: "__Host-grok-auth.dont_remember" },
    },
  },
  plugins: [
    gateIdentitySessions(),
    ...(grokOAuthPlugin ? [grokOAuthPlugin] : []),
    bearer(),
    tanstackStartCookies(),
  ],
});

export function readSessionToken(): string | null {
  return getCookie(SESSION_TOKEN_COOKIE) ?? null;
}

export { GROK_PROVIDERS } from "./providers";
