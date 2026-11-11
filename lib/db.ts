import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";

let pool: Pool | undefined;

export function getDb(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Set DATABASE_URL to your Postgres connection string.");

  pool = new Pool({ connectionString, max: 5, idleTimeoutMillis: 5_000 });
  if (process.env.VERCEL) attachDatabasePool(pool);
  return pool;
}
