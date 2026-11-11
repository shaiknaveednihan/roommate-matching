import type { Pool, PoolClient } from "pg";
import { getDb } from "./db";
import { calculateCompatibility } from "./matching";
import { canMessage, REPORT_HIDE_THRESHOLD } from "./options";
import { getReportCount, getUserById, rowToProfile, type UserRow } from "./users";

export async function canChatWith(
  me: UserRow,
  other: UserRow,
  db: Pool | PoolClient = getDb()
): Promise<boolean> {
  const eligible =
    me.id !== other.id &&
    !!me.profile_complete &&
    !!other.profile_complete &&
    !!me.gender &&
    me.gender === other.gender &&
    me.location === other.location &&
    canMessage(calculateCompatibility(rowToProfile(me), rowToProfile(other)));

  if (!eligible) return false;
  return (
    (await getReportCount(me.id, db)) < REPORT_HIDE_THRESHOLD &&
    (await getReportCount(other.id, db)) < REPORT_HIDE_THRESHOLD
  );
}

export async function getChatPartner(me: UserRow, id: number): Promise<UserRow | undefined> {
  const other = await getUserById(id);
  if (other && await canChatWith(me, other)) return other;
}

export async function getMessages(userId: number, partnerId: number) {
  const { rows } = await getDb().query<{ id: number; senderId: number; body: string }>(
    `SELECT id, sender_id AS "senderId", body FROM messages
     WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)
     ORDER BY id DESC LIMIT 100`,
    [userId, partnerId]
  );
  return rows.reverse();
}

export async function getConversations(me: UserRow) {
  const { rows } = await getDb().query<UserRow>(
    `SELECT users.* FROM users
     JOIN (
       SELECT partner_id, MAX(message_id) AS latest FROM (
         SELECT recipient_id AS partner_id, id AS message_id FROM messages WHERE sender_id = $1
         UNION ALL
         SELECT sender_id AS partner_id, id AS message_id FROM messages WHERE recipient_id = $1
       ) AS participants GROUP BY partner_id
     ) AS threads ON users.id = threads.partner_id
     ORDER BY threads.latest DESC`,
    [me.id]
  );

  const conversations: UserRow[] = [];
  for (const partner of rows) {
    if (await canChatWith(me, partner)) conversations.push(partner);
  }
  return conversations;
}

export async function sendMessage(senderId: number, recipientId: number, body: string): Promise<boolean> {
  if (!Number.isInteger(recipientId) || recipientId < 1 || recipientId > 2147483647) return false;
  if (senderId === recipientId) return false;

  const client = await getDb().connect();
  try {
    await client.query("BEGIN");
    // Lock in ID order so opposite-direction sends serialize without deadlocking.
    const { rows } = await client.query<UserRow>(
      "SELECT * FROM users WHERE id IN ($1, $2) ORDER BY id FOR UPDATE",
      [senderId, recipientId]
    );
    const sender = rows.find((row) => row.id === senderId);
    const recipient = rows.find((row) => row.id === recipientId);
    if (!sender || !recipient || !(await canChatWith(sender, recipient, client))) {
      await client.query("ROLLBACK");
      return false;
    }
    await client.query(
      "INSERT INTO messages (sender_id, recipient_id, body) VALUES ($1, $2, $3)",
      [senderId, recipientId, body]
    );
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
