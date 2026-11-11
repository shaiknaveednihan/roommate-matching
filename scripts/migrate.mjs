import { readFile } from "node:fs/promises";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("Set DATABASE_URL to your Postgres connection string.");

const sql = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
const client = new Client({ connectionString });
await client.connect();
try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(197303, 1)");
  await client.query(sql);
  await client.query("COMMIT");
  console.log("RoomMate database schema is ready.");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
