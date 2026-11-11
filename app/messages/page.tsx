import Link from "next/link";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/auth";
import { getConversations } from "@/lib/messages";

export default async function MessagesPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (!me.profile_complete) redirect("/onboarding");
  if (!me.gender) redirect("/account");

  const conversations = await getConversations(me);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <AppHeader active="messages" />
      <h1 className="text-3xl font-semibold">Messages</h1>
      {conversations.length ? (
        <ul className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200">
          {conversations.map(({ id, name }) => (
            <li key={id}>
              <Link className="block px-5 py-4 font-medium hover:underline" href={`/messages/${id}`}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-600">
          No conversations yet. <Link href="/matches" className="underline">Find someone to message</Link>.
        </p>
      )}
    </main>
  );
}
