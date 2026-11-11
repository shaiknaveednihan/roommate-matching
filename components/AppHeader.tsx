import Link from "next/link";
import LogoutButton from "./LogoutButton";

// Top bar shown on every page after login.
export default function AppHeader({
  active,
}: {
  active?: "matches" | "account" | "messages";
}) {
  const link = (isActive: boolean) =>
    isActive
      ? "text-sm font-medium text-gray-900"
      : "text-sm text-gray-500 hover:text-black";

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
      <Link href="/" className="text-lg font-semibold text-gray-900">
        RoomMate
      </Link>

      <nav className="flex flex-wrap items-center gap-4">
        <Link href="/matches" className={link(active === "matches")}>
          Matches
        </Link>
        <Link href="/messages" className={link(active === "messages")}>
          Messages
        </Link>
        <Link href="/account" className={link(active === "account")}>
          My Profile
        </Link>
        <LogoutButton />
      </nav>
    </div>
  );
}
