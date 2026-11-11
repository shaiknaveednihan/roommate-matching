import { randomBytes, scryptSync } from "node:crypto";
import { readFile } from "node:fs/promises";

export async function seedDemoUsers(client) {
  const profiles = JSON.parse(await readFile(new URL("./demo-profiles.json", import.meta.url), "utf8"));
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(randomBytes(32), salt, 64).toString("hex");

  const { rowCount } = await client.query(
    `INSERT INTO users (
       email, password_hash, name, age, location, gender, snoring, lights,
       overnight_guests, chores, budget, cleanliness, sleep, social, smoking,
       alcohol, noise, guests, food, room_type, conflict, hobbies, bio, profile_complete
     )
     SELECT email, $2, name, age, location, gender, snoring, lights,
            overnight_guests, chores, budget, cleanliness, sleep, social, smoking,
            alcohol, noise, guests, food, room_type, conflict, hobbies,
            'Sample profile for exploring RoomMate.', 1
     FROM jsonb_to_recordset($1::jsonb) AS profile (
       email text, name text, age integer, location text, gender text,
       snoring text, lights text, overnight_guests text, chores text,
       budget text, cleanliness text, sleep text, social text, smoking text,
       alcohol text, noise text, guests text, food text, room_type text,
       conflict text, hobbies text
     )
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     WHERE users.bio = EXCLUDED.bio
       AND users.name = EXCLUDED.name || ' (Demo)'`,
    [JSON.stringify(profiles), `${salt}:${hash}`]
  );
  return rowCount;
}
