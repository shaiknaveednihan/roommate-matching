import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ReportButton from "@/components/ReportButton";
import { canChatWith } from "@/lib/messages";
import { getCurrentUser } from "@/lib/auth";
import {
  compatibilityBreakdown,
  calculateCompatibility,
} from "@/lib/matching";
import {
  CHAT_THRESHOLD,
  REPORT_HIDE_THRESHOLD,
  labelFor,
} from "@/lib/options";
import {
  getReportCount,
  getUserById,
  hasReported,
  rowToProfile,
} from "@/lib/users";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (!me.profile_complete) redirect("/onboarding");

  if (!me.gender) redirect("/account");

  const { id } = await params;
  const row = await getUserById(Number(id));

  // not found, unfinished, or hidden because of too many reports
  if (
    !row || !row.profile_complete || row.gender !== me.gender ||
    row.location !== me.location || await getReportCount(row.id) >= REPORT_HIDE_THRESHOLD
  )
    notFound();

  const roommate = rowToProfile(row);
  const isMe = row.id === me.id;
  const mine = rowToProfile(me);

  const compatibility = calculateCompatibility(mine, roommate);
  const breakdown = compatibilityBreakdown(mine, roommate);

  const lifestyle = [
    ["Monthly Budget", labelFor("budget", roommate.budget)],
    ["Room Type", labelFor("roomType", roommate.roomType)],
    ["Sleep Schedule", labelFor("sleep", roommate.sleep)],
    ["Snoring", labelFor("snoring", roommate.snoring)],
    ["Lights while sleeping", labelFor("lights", roommate.lights)],
    ["Overnight guests", labelFor("overnightGuests", roommate.overnightGuests)],
    ["Dividing chores", labelFor("chores", roommate.chores)],
    ["Cleanliness", labelFor("cleanliness", roommate.cleanliness)],
    ["Noise", labelFor("noise", roommate.noise)],
    ["Guests", labelFor("guests", roommate.guests)],
    ["Social Preference", labelFor("social", roommate.social)],
    ["Food", labelFor("food", roommate.food)],
    ["Smoking", labelFor("smoking", roommate.smoking)],
    ["Alcohol", labelFor("alcohol", roommate.alcohol)],
    ["When disagreeing", labelFor("conflict", roommate.conflict)],
  ];

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <AppHeader active={isMe ? "account" : "matches"} />

        {/* Profile Header */}
        <section className="rounded-2xl border border-gray-200 p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gray-100 text-4xl font-semibold text-gray-700">
              {roommate.name.charAt(0)}
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                {roommate.name}
              </h1>
              <p className="mt-2 text-gray-500">
                {roommate.age} years old · {roommate.location}
              </p>
              {!isMe && (
                <div className="mt-4 inline-flex items-center rounded-full bg-gray-100 px-4 py-2">
                  <span className="text-sm font-medium text-gray-700">
                    {compatibility}% compatible with you
                  </span>
                </div>
              )}
            </div>
          </div>

          {roommate.bio && <p className="mt-6 leading-7 text-gray-600">{roommate.bio}</p>}
        </section>

        {/* Lifestyle */}
        <section className="mt-6 rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Lifestyle</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {lifestyle.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-2 font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {roommate.hobbies.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {roommate.hobbies.map((h) => (
                <span key={h} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                  {h}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Compatibility breakdown */}
        {!isMe && (
          <section className="mt-6 rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Why {compatibility}%?</h2>
            <p className="mt-3 leading-7 text-gray-600">
              Each factor counts for a different share of the total score.
            </p>

            <div className="mt-6 space-y-4">
              {breakdown.map((f) => (
                <div key={f.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {f.label} <span className="text-gray-400">(worth {f.weight}%)</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      {Math.round(f.score * f.weight)} / {f.weight}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{ width: `${f.score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isMe && (
          <section className="mt-6 rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Chat</h2>
            {await canChatWith(me, row) ? (
              <Link href={`/messages/${roommate.id}`} className="mt-4 inline-block rounded-xl bg-black px-6 py-3 text-sm font-medium text-white">
                Message {roommate.name.split(" ")[0]}
              </Link>
            ) : (
              <p className="mt-3 text-gray-600">
                {compatibility > CHAT_THRESHOLD
                  ? "Chat is unavailable for this match."
                  : `Chat unlocks above ${CHAT_THRESHOLD}% compatibility.`}
              </p>
            )}
          </section>
        )}

        {/* Report */}
        {!isMe && (
          <section className="mt-6">
            <ReportButton
              reportedId={roommate.id}
              name={roommate.name}
              alreadyReported={await hasReported(me.id, roommate.id)}
            />
          </section>
        )}

        <div className="mt-8 pb-10">
          <Link
            href="/matches"
            className="inline-block rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            ← Back to Matches
          </Link>
        </div>
      </div>
    </main>
  );
}
