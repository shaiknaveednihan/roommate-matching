import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateProfile } from "@/lib/users";
import { validateProfile } from "@/lib/validate";

// Used both by the first-time questionnaire and by "Edit profile".
export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = validateProfile(await request.json().catch(() => null));
  if (!parsed.ok)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  await updateProfile(user.id, parsed.value);
  return NextResponse.json({ ok: true });
}
