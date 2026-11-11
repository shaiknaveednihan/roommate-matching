import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  addReport,
  getReportCount,
  getUserById,
} from "@/lib/users";
import { REPORT_HIDE_THRESHOLD } from "@/lib/options";
import { validateReport } from "@/lib/validate";

export async function POST(request: Request) {
  const me = await getCurrentUser();
  if (!me || !me.profile_complete)
    return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const parsed = validateReport(await request.json().catch(() => null));
  if (!parsed.ok)
    return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { reportedId, reason, details } = parsed.value;

  if (reportedId === me.id)
    return NextResponse.json(
      { error: "You can't report your own profile." },
      { status: 400 }
    );
  if (!(await getUserById(reportedId)))
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  if (!(await addReport(me.id, reportedId, reason, details)))
    return NextResponse.json(
      { error: "You have already reported this profile." },
      { status: 409 }
    );

  return NextResponse.json({
    ok: true,
    hidden: await getReportCount(reportedId) >= REPORT_HIDE_THRESHOLD,
  });
}
