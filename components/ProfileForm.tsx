"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CITIES, GENDERS, HOBBIES, OPTIONS, OptionField } from "@/lib/options";

export type ProfileFormValues = {
  name: string;
  age: string;
  location: string;
  gender: string;
  snoring: string;
  lights: string;
  overnightGuests: string;
  chores: string;
  budget: string;
  cleanliness: string;
  sleep: string;
  social: string;
  smoking: string;
  alcohol: string;
  noise: string;
  guests: string;
  food: string;
  roomType: string;
  conflict: string;
  hobbies: string[];
  bio: string;
};

export const EMPTY_PROFILE: ProfileFormValues = {
  name: "",
  age: "",
  location: "",
  gender: "",
  snoring: "",
  lights: "",
  overnightGuests: "",
  chores: "",
  budget: "",
  cleanliness: "",
  sleep: "",
  social: "",
  smoking: "",
  alcohol: "",
  noise: "",
  guests: "",
  food: "",
  roomType: "",
  conflict: "",
  hobbies: [],
  bio: "",
};

// The questionnaire, grouped into sections. To add a question: add it to OPTIONS in
// lib/options.ts, give it a weight in lib/matching.ts, then list it here.
const GROUPS: {
  title: string;
  questions: { field: OptionField; title: string; cols: string }[];
}[] = [
  {
    title: "Daily routine",
    questions: [
      { field: "sleep", title: "Sleep schedule", cols: "sm:grid-cols-3" },
      { field: "snoring", title: "How often do you snore?", cols: "sm:grid-cols-3" },
      { field: "lights", title: "What lighting do you prefer while sleeping?", cols: "sm:grid-cols-3" },
      { field: "cleanliness", title: "Cleanliness", cols: "sm:grid-cols-2" },
      { field: "noise", title: "Noise at home", cols: "sm:grid-cols-3" },
    ],
  },
  {
    title: "Habits",
    questions: [
      { field: "smoking", title: "Do you smoke?", cols: "sm:grid-cols-3" },
      { field: "alcohol", title: "Do you drink alcohol?", cols: "sm:grid-cols-3" },
      { field: "food", title: "Food preference", cols: "sm:grid-cols-3" },
    ],
  },
  {
    title: "Social life",
    questions: [
      { field: "social", title: "Social preference", cols: "sm:grid-cols-3" },
      { field: "overnightGuests", title: "How often do you have overnight guests?", cols: "sm:grid-cols-3" },
      { field: "guests", title: "How often do you have guests over?", cols: "sm:grid-cols-3" },
    ],
  },
  {
    title: "Living preferences",
    questions: [
      { field: "chores", title: "How do you prefer to divide chores?", cols: "sm:grid-cols-3" },
      { field: "budget", title: "Monthly budget", cols: "sm:grid-cols-2" },
      { field: "roomType", title: "Room type", cols: "sm:grid-cols-3" },
    ],
  },
  {
    title: "Personality",
    questions: [
      { field: "conflict", title: "When you disagree with a roommate, you usually…", cols: "sm:grid-cols-3" },
    ],
  },
];

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black";

/**
 * mode "create": first-time questionnaire  -> saves, then goes to /matches
 * mode "edit":   edit profile page          -> saves, stays and shows a message
 */
export default function ProfileForm({
  mode,
  initial = EMPTY_PROFILE,
  email,
}: {
  mode: "create" | "edit";
  initial?: ProfileFormValues;
  email?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProfileFormValues>(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  function toggleHobby(hobby: string) {
    set(
      "hobbies",
      values.hobbies.includes(hobby)
        ? values.hobbies.filter((h) => h !== hobby)
        : [...values.hobbies, hobby]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, age: Number(values.age) }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not save your profile.");
      return;
    }

    if (mode === "create") {
      router.push("/matches");
    } else {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic information */}
      <section className="rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Basic information</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Full name</label>
            <input
              type="text"
              required
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Enter your name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              required
              min="16"
              max="60"
              value={values.age}
              onChange={(e) => set("age", e.target.value)}
              placeholder="Enter your age"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
            <select
              required
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Select your city
              </option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Gender
            <select
              required
              value={values.gender}
              onChange={(e) => set("gender", e.target.value)}
              className={`mt-2 ${inputClass}`}
            >
              <option value="" disabled>Select your gender</option>
              {GENDERS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          {email && (
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email (login ID)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className={`${inputClass} bg-gray-50 text-gray-500`}
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              About you <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              maxLength={300}
              value={values.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="A line or two about yourself"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Radio questions, grouped */}
      {GROUPS.map((group) => (
        <section key={group.title} className="rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">{group.title}</h2>

          <div className="mt-6 space-y-8">
            {group.questions.map(({ field, title, cols }) => (
              <div key={field}>
                <h3 className="text-sm font-medium text-gray-700">{title}</h3>

                <div className={`mt-3 grid gap-3 ${cols}`}>
                  {OPTIONS[field].map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-black"
                    >
                      <input
                        type="radio"
                        name={field}
                        value={option.value}
                        required
                        checked={values[field] === option.value}
                        onChange={(e) => set(field, e.target.value)}
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Hobbies */}
      <section className="rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Hobbies & interests</h2>
        <p className="mt-1 text-sm text-gray-500">Pick as many as you like.</p>

        <div className="mt-5 flex flex-wrap gap-3">
          {HOBBIES.map((hobby) => {
            const on = values.hobbies.includes(hobby);
            return (
              <button
                type="button"
                key={hobby}
                onClick={() => toggleHobby(hobby)}
                aria-pressed={on}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  on
                    ? "border-black bg-black text-white"
                    : "border-gray-200 text-gray-700 hover:border-black"
                }`}
              >
                {hobby}
              </button>
            );
          })}
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="rounded-xl bg-green-50 px-5 py-4 text-sm text-green-700">
          Profile saved. Your matches have been updated.
        </p>
      )}

      <div className="flex justify-end pb-10">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black px-7 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : mode === "create"
            ? "Find Compatibility →"
            : "Save changes"}
        </button>
      </div>
    </form>
  );
}
