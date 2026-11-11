import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/auth";
import { rowToProfile } from "@/lib/users";

// "My Profile" — the logged-in user edits their own details here.
export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.profile_complete) redirect("/onboarding");

  const p = rowToProfile(user);

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <AppHeader active="account" />

        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            My profile
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Keep this accurate — other students rely on it, and profiles that
            don&apos;t match reality can be reported.
          </p>
        </div>

        {!user.gender && (
          <p className="mb-6 rounded-xl bg-gray-100 p-4 text-sm">
            Add your gender and answer the new questions to see your matches.
          </p>
        )}

        <ProfileForm
          mode="edit"
          email={user.email}
          initial={{
            name: p.name,
            age: String(p.age),
            location: p.location,
            gender: p.gender,
            snoring: p.snoring,
            lights: p.lights,
            overnightGuests: p.overnightGuests,
            chores: p.chores,
            budget: p.budget,
            cleanliness: p.cleanliness,
            sleep: p.sleep,
            social: p.social,
            smoking: p.smoking,
            alcohol: p.alcohol,
            noise: p.noise,
            guests: p.guests,
            food: p.food,
            roomType: p.roomType,
            conflict: p.conflict,
            hobbies: p.hobbies,
            bio: p.bio,
          }}
        />
      </div>
    </main>
  );
}
