"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

export default function MessageComposer({ partnerId }: { partnerId: number }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 4000);
    return () => window.clearInterval(interval);
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");

    try {
      const response = await fetch(`/api/messages/${partnerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Could not send your message. Try again.");
        return;
      }
      setBody("");
      router.refresh();
    } catch {
      setError("Could not send your message. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <label htmlFor="message" className="block text-sm font-medium">Your message</label>
      <textarea
        id="message"
        rows={3}
        maxLength={1000}
        required
        disabled={sending}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={sending || !body.trim()}
        className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
