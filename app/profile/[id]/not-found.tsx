import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold text-gray-900">Profile not available</h1>
        <p className="mt-3 text-gray-600">
          This profile doesn&apos;t exist or is currently under review.
        </p>
        <Link
          href="/matches"
          className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white"
        >
          ← Back to Matches
        </Link>
      </div>
    </main>
  );
}
