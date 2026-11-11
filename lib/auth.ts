import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";
import { getUserById, UserRow } from "./users";

const COOKIE = "session";
const SESSION_DAYS = 7;

/** Log the user in: store a random token in the DB and in a cookie. */
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;

  await getDb().query(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)",
    [token, userId, expiresAt]
  );

  (await cookies()).set(COOKIE, token, {
    httpOnly: true, // JavaScript in the browser can't read it
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

/** Log out: delete the session from the DB and the cookie. */
export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await getDb().query("DELETE FROM sessions WHERE token = $1", [token]);
  store.delete(COOKIE);
}

/** The logged-in user (or null). Use this in pages and API routes. */
export async function getCurrentUser(): Promise<UserRow | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const { rows } = await getDb().query<{ user_id: number }>(
    "SELECT user_id FROM sessions WHERE token = $1 AND expires_at >= $2",
    [token, Date.now()]
  );
  return rows[0] ? (await getUserById(rows[0].user_id)) ?? null : null;
}
