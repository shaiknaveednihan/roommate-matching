import { OPTIONS, OptionField } from "./options";

export type UserProfile = {
  id: number;
  name: string;
  age: number;
  location: string;
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
  gender: string;
  snoring: string;
  lights: string;
  overnightGuests: string;
  chores: string;
};

// Weightage of each factor — must add up to 100.
//
// How the weights were chosen: the more a mismatch causes DAILY conflict and the
// harder it is to compromise on, the higher the weight.
//   High   (12-16): smoking, sleep schedule, cleanliness  -> daily friction, hard to compromise
//   Medium (6-7)  : noise, guests, food, alcohol, budget  -> real friction, but negotiable
//   Low    (2-5)  : room type, conflict style, social, hobbies and shared-room habits
export const WEIGHTS = {
  smoking: 16,
  sleep: 12,
  cleanliness: 12,
  noise: 7,
  guests: 7,
  food: 7,
  alcohol: 6,
  budget: 6,
  roomType: 5,
  conflict: 4,
  social: 3,
  hobbies: 3,
  snoring: 4,
  lights: 3,
  overnightGuests: 3,
  chores: 2,
} as const;

export type Factor = keyof typeof WEIGHTS;

export const FACTOR_LABELS: Record<Factor, string> = {
  smoking: "Smoking",
  sleep: "Sleep schedule",
  cleanliness: "Cleanliness",
  noise: "Noise tolerance",
  guests: "Guests / visitors",
  food: "Food preference",
  alcohol: "Alcohol",
  budget: "Budget",
  roomType: "Room type",
  conflict: "Handling disagreements",
  social: "Social preference",
  hobbies: "Hobbies",
  snoring: "Snoring",
  lights: "Lights while sleeping",
  overnightGuests: "Overnight guests",
  chores: "Dividing chores",
};

/**
 * How close are two answers on an ordered scale? 1 = same, 0 = opposite ends.
 * e.g. sleep: early / normal / late  ->  early vs normal = 0.5, early vs late = 0
 */
function closeness(field: OptionField, a: string, b: string): number {
  const values: string[] = OPTIONS[field].map((o) => o.value);
  const ia = values.indexOf(a);
  const ib = values.indexOf(b);
  if (ia === -1 || ib === -1) return 0;
  return 1 - Math.abs(ia - ib) / (values.length - 1);
}

/** Share of hobbies in common, relative to the smaller list. */
function hobbyOverlap(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const shared = a.filter((h) => b.includes(h)).length;
  return shared / Math.min(a.length, b.length);
}

export type FactorScore = {
  key: Factor;
  label: string;
  weight: number;
  /** 0 to 1 */
  score: number;
};

export function compatibilityBreakdown(
  user: UserProfile,
  other: UserProfile
): FactorScore[] {
  return (Object.keys(WEIGHTS) as Factor[]).map((key) => ({
    key,
    label: FACTOR_LABELS[key],
    weight: WEIGHTS[key],
    score:
      key === "hobbies"
        ? hobbyOverlap(user.hobbies, other.hobbies)
        : closeness(key, user[key], other[key]),
  }));
}

/** Overall compatibility as a whole number from 0 to 100. */
export function calculateCompatibility(
  user: UserProfile,
  other: UserProfile
): number {
  const total = compatibilityBreakdown(user, other).reduce(
    (sum, f) => sum + f.score * f.weight,
    0
  );
  return Math.round(total);
}
