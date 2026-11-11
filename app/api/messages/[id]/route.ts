import { getCurrentUser } from "@/lib/auth";
import { sendMessage } from "@/lib/messages";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Please log in." }, { status: 401 });

  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const body = typeof payload?.body === "string" ? payload.body.trim() : "";
  if (!body || body.length > 1000) {
    return Response.json({ error: "Write a message of 1–1,000 characters." }, { status: 400 });
  }

  if (!(await sendMessage(user.id, Number(id), body))) {
    return Response.json({ error: "This conversation is unavailable." }, { status: 403 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
