import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import MessageComposer from "@/components/MessageComposer";
import { getCurrentUser } from "@/lib/auth";
import { getChatPartner, getMessages } from "@/lib/messages";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (!me.profile_complete) redirect("/onboarding");
  if (!me.gender) redirect("/account");

  const { id } = await params;
  const partner = await getChatPartner(me, Number(id));
  if (!partner) notFound();

  const messages = await getMessages(me.id, partner.id);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <AppHeader active="messages" />
      <Link href="/messages" className="text-sm underline">Back to messages</Link>
      <h1 className="mt-4 text-3xl font-semibold">Chat with {partner.name}</h1>
      <section aria-label="Conversation" className="mt-6 rounded-2xl border border-gray-200 p-5">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-600">Start the conversation with a message.</p>
        ) : (
          <ol aria-live="polite" className="space-y-3">
            {messages.map(({ id, senderId, body }) => (
              <li
                key={id}
                className={`w-fit max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 [overflow-wrap:anywhere] ${
                  senderId === me.id ? "ml-auto bg-black text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <span className="sr-only">{senderId === me.id ? "You: " : `${partner.name}: `}</span>
                {body}
              </li>
            ))}
          </ol>
        )}
      </section>
      <MessageComposer partnerId={partner.id} />
    </main>
  );
}
