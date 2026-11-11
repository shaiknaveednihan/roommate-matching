import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { createUser } from "@/lib/users";
import { validateCredentials } from "@/lib/validate";

export async function POST(request: Request) {
  const parsed = validateCredentials(await request.json().catch(() => null));
  if (!parsed.ok)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { email, password } = parsed.value;

  const id = await createUser(email, hashPassword(password));
  if (!id)
    return NextResponse.json(
      { error: "An account with this email already exists. Please log in." },
      { status: 409 }
    );

  await createSession(id);

  // New account -> questionnaire first
  return NextResponse.json({ redirect: "/onboarding" }, { status: 201 });
}
