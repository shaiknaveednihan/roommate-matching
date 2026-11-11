import Link from "next/link";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/auth";
import { canMessage, CHAT_THRESHOLD, labelFor, REPORT_HIDE_THRESHOLD } from "@/lib/options";
import { getMatches, getReportCount, rowToProfile } from "@/lib/users";

export default async function MatchesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.profile_complete) redirect("/onboarding");

  if (!user.gender) redirect("/account");

  const me = rowToProfile(user);
  const matches = await getMatches(me);
  const canStartChat = await getReportCount(me.id) < REPORT_HIDE_THRESHOLD;

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <AppHeader active="matches" />

        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-500">YOUR MATCHES</p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900">
            Compatible roommates in {me.location}
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Hi {me.name.split(" ")[0]}! These students are ranked by how
            compatible their lifestyle is with yours.
          </p>
        </div>

        {/* Matches */}
        <div className="space-y-5">
          {matches.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900">No matches found</h2>
              <p className="mt-2 text-gray-600">
                No completed profiles match your city and gender yet.
              </p>
              <Link
                href="/account"
                className="mt-5 inline-block rounded-xl bg-black px-6 py-3 text-sm font-medium text-white"
              >
                Edit Profile
              </Link>
            </div>
          ) : (
            matches.map(({ user: roommate, compatibility }) => (
              <div
                key={roommate.id}
                className="rounded-2xl border border-gray-200 p-6 transition hover:border-gray-400"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  {/* User information */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xl font-semibold text-gray-700">
                        {roommate.name.charAt(0)}
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{roommate.name}</h2>
                        <p className="text-sm text-gray-500">
                          {roommate.age} years old · {roommate.location}
                        </p>
                      </div>
                    </div>

                    {/* Compatibility */}
                    <div className="mt-5 max-w-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Compatibility</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {compatibility}%
                        </span>
                      </div>

                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{ width: `${compatibility}%` }}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {[
                        labelFor("budget", roommate.budget),
                        labelFor("cleanliness", roommate.cleanliness),
                        labelFor("sleep", roommate.sleep),
                        labelFor("food", roommate.food),
                        `Smoking: ${labelFor("smoking", roommate.smoking).toLowerCase()}`,
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}

                      {canStartChat && canMessage(compatibility) ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Chat available
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-500">
                          🔒 Chat locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile button */}
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {canStartChat && canMessage(compatibility) && (
                      <Link href={`/messages/${roommate.id}`} className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium">
                        Message
                      </Link>
                    )}
                    <Link
                      href={`/profile/${roommate.id}`}
                      className="inline-block rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom note */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="font-semibold text-gray-900">How this works</h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Your matches share your city and gender. Open a profile to see how each
            questionnaire answer contributes to the compatibility score.
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Chat is available for matches above {CHAT_THRESHOLD}% compatibility. Found someone whose profile isn&apos;t true? Open their
            profile and report it.
          </p>
        </div>
      </div>
    </main>
  );
}
