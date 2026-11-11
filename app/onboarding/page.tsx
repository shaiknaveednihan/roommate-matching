import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/auth";

// First-time questionnaire (shown right after registering).
export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.profile_complete) redirect("/matches"); // already done -> they can edit in /account

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <AppHeader />

        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Tell us about yourself
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            We&apos;ll use your answers to find students whose lifestyle and
            preferences are compatible with yours. You can edit them any time
            from My Profile.
          </p>
        </div>

        <ProfileForm mode="create" email={user.email} />
      </div>
    </main>
  );
}
