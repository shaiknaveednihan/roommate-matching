import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const steps = [
  {
    title: "Create Your Profile",
    description: "Tell us about your budget, location and lifestyle.",
  },
  {
    title: "Set Your Preferences",
    description: "Tell us what kind of living environment you prefer.",
  },
  {
    title: "Discover Compatible Roommates",
    description: "See people ranked according to compatibility.",
  },
  {
    title: "Chat in RoomMate",
    description: "Message roommates above 80% compatibility.",
  },
];

export default async function Home() {
  const user = await getCurrentUser();
  const loggedIn = !!user;

  return (
    <div className="flex flex-1 flex-col">
      {/* Navigation */}
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            RoomMate
          </span>
          <nav className="hidden items-center gap-8 text-sm text-ink-muted sm:flex">
            <a href="#how-it-works" className="hover:text-ink">
              How it works
            </a>
            <a href="#about" className="hover:text-ink">
              About
            </a>
          </nav>
          <Link
            href={loggedIn ? "/matches" : "/login"}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
          >
            {loggedIn ? "My Matches" : "Login"}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <h1 className="font-display max-w-lg text-4xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-5xl sm:leading-[1.1]">
            Find Someone Compatible to Live With.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-7 text-ink-muted">
            Discover roommates based on lifestyle, budget, and location.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={loggedIn ? "/matches" : "/login"}
              className="rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-background transition-colors hover:bg-primary-dark"
            >
              Find My Roommate
            </Link>
            {!loggedIn && (
              <Link
                href="/login"
                className="rounded-md border border-line px-6 py-3 text-center text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        <CompatibilityDiagram />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            How it works
          </h2>

          <ol className="relative mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div
              aria-hidden
              className="absolute top-4 left-0 hidden h-px w-full bg-line lg:block"
            />
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex flex-col gap-3">
                <span className="font-display relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-surface text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <h3 className="text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-ink-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About / disclaimer */}
      <section id="about" className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10">
          <div className="max-w-2xl border-l-2 border-accent pl-6">
            <p className="text-base leading-7 text-ink-muted">
              The platform helps you discover compatible people. Users
              independently decide where they want to live and arrange their
              accommodation.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span className="font-display font-medium text-ink">RoomMate</span>
          <span>Built for students finding a place to live.</span>
        </div>
      </footer>
    </div>
  );
}

function CompatibilityDiagram() {
  return (
    <svg
      viewBox="0 0 420 320"
      className="mx-auto w-full max-w-sm text-primary"
      role="img"
      aria-label="Diagram showing two profiles connected through shared preferences such as budget, schedule, and cleanliness"
    >
      <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5">
        <line x1="80" y1="90" x2="210" y2="60" />
        <line x1="80" y1="90" x2="210" y2="160" />
        <line x1="80" y1="90" x2="210" y2="250" />
        <line x1="340" y1="230" x2="210" y2="60" />
        <line x1="340" y1="230" x2="210" y2="160" />
        <line x1="340" y1="230" x2="210" y2="250" />
      </g>

      <circle cx="80" cy="90" r="26" fill="var(--color-primary)" />
      <circle cx="340" cy="230" r="26" fill="var(--color-accent)" />

      <g fill="var(--color-background)" stroke="currentColor" strokeWidth="1.5">
        <circle cx="210" cy="60" r="16" />
        <circle cx="210" cy="160" r="16" />
        <circle cx="210" cy="250" r="16" />
      </g>

      <g fontSize="11" fill="var(--color-ink-muted)" fontFamily="var(--font-plex)">
        <text x="234" y="64" textAnchor="start">
          Budget
        </text>
        <text x="234" y="164" textAnchor="start">
          Schedule
        </text>
        <text x="234" y="254" textAnchor="start">
          Cleanliness
        </text>
      </g>
    </svg>
  );
}