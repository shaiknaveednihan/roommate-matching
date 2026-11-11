"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REPORT_REASONS } from "@/lib/options";

export default function ReportButton({
  reportedId,
  name,
  alreadyReported,
}: {
  reportedId: number;
  name: string;
  alreadyReported: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(alreadyReported);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportedId, reason, details }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not send the report.");
      return;
    }
    setDone(true);
    setOpen(false);
    // if enough people reported, the profile is now hidden -> go back
    if (data.hidden) router.push("/matches");
    else router.refresh();
  }

  if (done) {
    return (
      <p className="text-sm text-gray-500">
        ✓ You reported this profile. Thanks — we&apos;ll review it.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-500 underline hover:text-red-600"
      >
        Report this profile
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-red-200 bg-red-50/40 p-5">
      <h3 className="font-semibold text-gray-900">Report {name}</h3>
      <p className="mt-1 text-sm text-gray-600">
        Use this if the person gave fake information or isn&apos;t what their
        profile says.
      </p>

      <select
        required
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
      >
        <option value="" disabled>
          Select a reason
        </option>
        {REPORT_REASONS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <textarea
        rows={3}
        maxLength={500}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="What happened? (optional)"
        className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
      />

      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Submit report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
