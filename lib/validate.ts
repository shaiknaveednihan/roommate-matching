import { CITIES, GENDERS, HOBBIES, OPTIONS, OptionField, REPORT_REASONS } from "./options";
import type { ProfileInput } from "./users";

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCredentials(
  body: unknown
): Result<{ email: string; password: string }> {
  const b = (body ?? {}) as Record<string, unknown>;
  const email = String(b.email ?? "").trim().toLowerCase();
  const password = String(b.password ?? "");

  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };
  return { ok: true, value: { email, password } };
}

export function validateProfile(body: unknown): Result<ProfileInput> {
  const b = (body ?? {}) as Record<string, unknown>;

  const name = String(b.name ?? "").trim();
  if (name.length < 2 || name.length > 60)
    return { ok: false, error: "Enter your full name." };

  const age = Number(b.age);
  if (!Number.isInteger(age) || age < 16 || age > 60)
    return { ok: false, error: "Age must be between 16 and 60." };

  const location = String(b.location ?? "");
  if (!(CITIES as readonly string[]).includes(location))
    return { ok: false, error: "Choose a city from the list." };

  const gender = String(b.gender ?? "");
  if (!GENDERS.some((option) => option.value === gender))
    return { ok: false, error: "Choose a gender from the list." };

  const choices: Record<string, string> = {};
  for (const field of Object.keys(OPTIONS) as OptionField[]) {
    const value = String(b[field] ?? "");
    if (!OPTIONS[field].some((o) => o.value === value))
      return { ok: false, error: `Please answer the "${field}" question.` };
    choices[field] = value;
  }

  const hobbies = Array.isArray(b.hobbies) ? [...new Set(b.hobbies.map(String))] : [];
  if (!hobbies.every((h) => (HOBBIES as readonly string[]).includes(h)))
    return { ok: false, error: "Invalid hobby selected." };

  const bio = String(b.bio ?? "").trim().slice(0, 300);

  return {
    ok: true,
    value: { name, age, location, gender, hobbies, bio, ...(choices as Pick<ProfileInput, OptionField>) },
  };
}

export function validateReport(
  body: unknown
): Result<{ reportedId: number; reason: string; details: string }> {
  const b = (body ?? {}) as Record<string, unknown>;
  const reportedId = Number(b.reportedId);
  const reason = String(b.reason ?? "");
  const details = String(b.details ?? "").trim().slice(0, 500);

  if (!Number.isInteger(reportedId))
    return { ok: false, error: "Invalid profile." };
  if (!REPORT_REASONS.some((r) => r.value === reason))
    return { ok: false, error: "Choose a reason for the report." };
  return { ok: true, value: { reportedId, reason, details } };
}
