import { pendingMigrations } from "../../scripts/migration-plan.mjs";

/** Which database backend is active. */
export type DbSource = "neon" | "pglite";

const rawDatabaseUrl =
  typeof process !== "undefined" ? process.env.DATABASE_URL : undefined;
const databaseUrl =
  rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : undefined;

/**
 * Prefer Cloudflare Hyperdrive when running on Workers.
 * Uses process.getBuiltinModule (nodejs_compat) — does NOT dynamic-import
 * cloudflare:workers (that can hang the isolate).
 */
function resolvePgConnectionString(): string | undefined {
  try {
    const getBuiltin = (process as NodeJS.Process & {
      getBuiltinModule?: (name: string) => {
        env?: { HYPERDRIVE?: { connectionString?: string } };
      };
    }).getBuiltinModule;
    if (typeof getBuiltin === "function") {
      const mod = getBuiltin("cloudflare:workers");
      const hd = mod?.env?.HYPERDRIVE?.connectionString;
      if (hd) return hd;
    }
  } catch {
    // not on Workers
  }
  const g = globalThis as {
    HYPERDRIVE?: { connectionString?: string };
  };
  if (g.HYPERDRIVE?.connectionString) return g.HYPERDRIVE.connectionString;
  return databaseUrl;
}

export const dbSource: DbSource = databaseUrl || resolvePgConnectionString()
  ? "neon"
  : "pglite";

export interface Sql {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T[]>;
}

const globalRef = globalThis as typeof globalThis & {
  __pgliteInstance__?: Promise<import("@electric-sql/pglite").PGlite>;
  __pgliteMigrateChain__?: Promise<void>;
};

const OID_INT8 = 20;
const OID_DATE = 1082;
const OID_INTERVAL = 1186;
const identity = (v: string) => v;

type Run = <T>(text: string, params: unknown[]) => Promise<T[]>;

function toSql(run: Run): Sql {
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return run<T>(text, values);
  }) as unknown as Sql;
  sql.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  return sql;
}

/**
 * Cloudflare Workers: never share a pg.Pool across requests.
 * Create a Client per query, connect, run, end.
 * Hyperdrive handles the real pooling at the edge.
 */
function createNeonSql(): Promise<Sql> {
  return (async () => {
    const { Client, types } = await import("pg");
    types.setTypeParser(OID_INT8, Number);
    types.setTypeParser(OID_DATE, identity);
    types.setTypeParser(OID_INTERVAL, identity);

    const connectionString = resolvePgConnectionString();
    if (!connectionString) {
      throw new Error("No DATABASE_URL or Hyperdrive binding");
    }

    return toSql(async <T>(text: string, params: unknown[]) => {
      const client = new Client({
        connectionString,
        connectionTimeoutMillis: 5_000,
        query_timeout: 8_000,
      });
      await client.connect();
      try {
        const res = await client.query(text, params);
        return res.rows as T[];
      } finally {
        try {
          await client.end();
        } catch {
          // ignore close errors
        }
      }
    });
  })();
}

async function createPgliteSql(): Promise<Sql> {
  globalRef.__pgliteInstance__ ??= (async () => {
    const { PGlite } = await import("@electric-sql/pglite");
    const pg = new PGlite({
      parsers: {
        [OID_INT8]: Number,
        [OID_DATE]: identity,
        [OID_INTERVAL]: identity,
      },
    });
    await pg.waitReady;
    await pg.exec(
      "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
    );
    return pg;
  })().catch((err) => {
    globalRef.__pgliteInstance__ = undefined;
    throw err;
  });
  const pg = await globalRef.__pgliteInstance__;

  const migrate = async (): Promise<void> => {
    const migrations = import.meta.glob("/migrations/*.sql", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;
    const doneRows = await pg.query<{ name: string }>(
      "select name from _migrations",
    );
    const done = doneRows.rows.map((r) => r.name);
    for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) {
      await pg.transaction(async (tx) => {
        await tx.exec(migrations[path]);
        await tx.query("insert into _migrations (name) values ($1)", [name]);
      });
    }
  };
  const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve())
    .catch(() => undefined)
    .then(migrate);
  globalRef.__pgliteMigrateChain__ = pass;
  await pass;

  return toSql(async <T>(text: string, params: unknown[]) => {
    const result = await pg.query<T>(text, params);
    return result.rows;
  });
}

let sqlPromise: Promise<Sql> | null = null;

async function createSql(): Promise<Sql> {
  if (typeof window !== "undefined") {
    throw new Error(
      "@/lib/db is server-only — call getSql() from a createServerFn handler " +
        "or a server route loader, never from client code.",
    );
  }
  return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}

export function getSql(): Promise<Sql> {
  // On Workers, do not memoize forever across request contexts in a way that
  // reuses TCP sockets. The Sql runner creates a fresh Client per query.
  sqlPromise ??= createSql().catch((err) => {
    sqlPromise = null;
    throw err;
  });
  return sqlPromise;
}

export async function getPglite(): Promise<import("@electric-sql/pglite").PGlite> {
  if (dbSource !== "pglite") {
    throw new Error("getPglite() is only available on the PGLite fallback (no DATABASE_URL)");
  }
  await getSql();
  const pg = await globalRef.__pgliteInstance__;
  if (!pg) throw new Error("PGLite instance failed to initialize");
  return pg;
}

export function ensureDbReady(): Promise<void> {
  if (dbSource !== "pglite") return Promise.resolve();
  return getSql().then(() => undefined);
}
