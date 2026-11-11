import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  // already logged in? skip the form
  const user = await getCurrentUser();
  if (user) redirect(user.profile_complete ? "/matches" : "/onboarding");

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink">
            RoomMate
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <AuthForm />
      </main>
    </div>
  );
}
