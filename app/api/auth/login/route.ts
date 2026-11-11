import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { getUserByEmail } from "@/lib/users";
import { validateCredentials } from "@/lib/validate";

export async function POST(request: Request) {
  const parsed = validateCredentials(await request.json().catch(() => null));
  if (!parsed.ok)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { email, password } = parsed.value;
  const user = await getUserByEmail(email);

  // Same message for "no such user" and "wrong password" on purpose.
  if (!user || !verifyPassword(password, user.password_hash))
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );

  await createSession(user.id);

  // First login (questionnaire not filled yet) -> questionnaire, else matches
  return NextResponse.json({
    redirect: user.profile_complete ? "/matches" : "/onboarding",
  });
}
