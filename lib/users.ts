import type { Pool, PoolClient } from "pg";
import { getDb } from "./db";
import {
  calculateCompatibility,
  UserProfile,
} from "./matching";
import { REPORT_HIDE_THRESHOLD } from "./options";

/** A row exactly as stored in the `users` table. */
export type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  age: number | null;
  location: string | null;
  gender: string | null;
  snoring: string | null;
  lights: string | null;
  overnight_guests: string | null;
  chores: string | null;
  budget: string | null;
  cleanliness: string | null;
  sleep: string | null;
  social: string | null;
  smoking: string | null;
  alcohol: string | null;
  noise: string | null;
  guests: string | null;
  food: string | null;
  room_type: string | null;
  conflict: string | null;
  hobbies: string;
  bio: string;
  profile_complete: number;
};

/** DB row -> UserProfile (never includes the password hash). */
export function rowToProfile(row: UserRow): UserProfile {
  return {
    id: row.id,
    name: row.name ?? "",
    age: row.age ?? 0,
    location: row.location ?? "",
    budget: row.budget ?? "",
    cleanliness: row.cleanliness ?? "",
    sleep: row.sleep ?? "",
    social: row.social ?? "",
    smoking: row.smoking ?? "",
    alcohol: row.alcohol ?? "",
    noise: row.noise ?? "",
    guests: row.guests ?? "",
    food: row.food ?? "",
    roomType: row.room_type ?? "",
    conflict: row.conflict ?? "",
    hobbies: JSON.parse(row.hobbies || "[]"),
    bio: row.bio,
    gender: row.gender ?? "",
    snoring: row.snoring ?? "",
    lights: row.lights ?? "",
    overnightGuests: row.overnight_guests ?? "",
    chores: row.chores ?? "",
  };
}

type Db = Pool | PoolClient;

export async function getUserById(id: number, db: Db = getDb()): Promise<UserRow | undefined> {
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) return;
  const { rows } = await db.query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

export async function getUserByEmail(email: string): Promise<UserRow | undefined> {
  const { rows } = await getDb().query<UserRow>("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0];
}

export async function createUser(email: string, passwordHash: string): Promise<number | undefined> {
  const { rows } = await getDb().query<{ id: number }>(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING RETURNING id`,
    [email, passwordHash]
  );
  return rows[0]?.id;
}

export type ProfileInput = Omit<UserProfile, "id">;

export async function updateProfile(id: number, p: ProfileInput) {
  await getDb().query(
    `UPDATE users SET
       name = $1, age = $2, location = $3, gender = $4, snoring = $5, lights = $6,
       overnight_guests = $7, chores = $8, budget = $9, cleanliness = $10,
       sleep = $11, social = $12, smoking = $13, alcohol = $14, noise = $15,
       guests = $16, food = $17, room_type = $18, conflict = $19, hobbies = $20,
       bio = $21, profile_complete = 1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $22`,
    [
      p.name, p.age, p.location, p.gender, p.snoring, p.lights, p.overnightGuests,
      p.chores, p.budget, p.cleanliness, p.sleep, p.social, p.smoking, p.alcohol,
      p.noise, p.guests, p.food, p.roomType, p.conflict, JSON.stringify(p.hobbies),
      p.bio, id,
    ]
  );
}

export async function getReportCount(userId: number, db: Db = getDb()): Promise<number> {
  const { rows } = await db.query<{ count: number }>(
    "SELECT COUNT(*)::integer AS count FROM reports WHERE reported_id = $1 AND status != 'dismissed'",
    [userId]
  );
  return rows[0].count;
}

export async function hasReported(reporterId: number, reportedId: number): Promise<boolean> {
  const { rowCount } = await getDb().query(
    "SELECT 1 FROM reports WHERE reporter_id = $1 AND reported_id = $2",
    [reporterId, reportedId]
  );
  return rowCount === 1;
}

export async function addReport(
  reporterId: number,
  reportedId: number,
  reason: string,
  details: string
): Promise<boolean> {
  const { rowCount } = await getDb().query(
    `INSERT INTO reports (reporter_id, reported_id, reason, details)
     VALUES ($1, $2, $3, $4) ON CONFLICT (reporter_id, reported_id) DO NOTHING`,
    [reporterId, reportedId, reason, details]
  );
  return rowCount === 1;
}

export type Match = {
  user: UserProfile;
  compatibility: number;
};

export async function getMatches(me: UserProfile): Promise<Match[]> {
  const { rows } = await getDb().query<UserRow>(
    `SELECT u.* FROM users u
     WHERE u.id != $1 AND u.profile_complete = 1 AND u.location = $2 AND u.gender = $3
       AND (SELECT COUNT(*) FROM reports r
            WHERE r.reported_id = u.id AND r.status != 'dismissed') < $4`,
    [me.id, me.location, me.gender, REPORT_HIDE_THRESHOLD]
  );

  return rows
    .map((row) => {
      const user = rowToProfile(row);
      return { user, compatibility: calculateCompatibility(me, user) };
    })
    .sort((a, b) => b.compatibility - a.compatibility);
}
