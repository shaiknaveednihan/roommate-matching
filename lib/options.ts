// All the questionnaire choices live here, so the form, the matching
// algorithm and the profile pages always agree with each other.
// The ORDER matters: matching uses the position in each list
// (e.g. "never" is closer to "occasionally" than to "regularly").

export const OPTIONS = {
  snoring: [
    { value: "rarely", label: "Never or rarely" },
    { value: "sometimes", label: "Sometimes" },
    { value: "often", label: "Often" },
  ],
  lights: [
    { value: "dark", label: "Lights off" },
    { value: "dim", label: "Dim light" },
    { value: "on", label: "Lights on" },
  ],
  overnightGuests: [
    { value: "rarely", label: "Rarely or never" },
    { value: "sometimes", label: "Occasionally" },
    { value: "often", label: "Often" },
  ],
  chores: [
    { value: "schedule", label: "Set a schedule" },
    { value: "flexible", label: "Take turns informally" },
    { value: "as-needed", label: "Do chores as needed" },
  ],

  budget: [
    { value: "under-5000", label: "Under ₹5,000" },
    { value: "5000-8000", label: "₹5,000 – ₹8,000" },
    { value: "8000-12000", label: "₹8,000 – ₹12,000" },
    { value: "12000-16000", label: "₹12,000 – ₹16,000" },
    { value: "16000-plus", label: "₹16,000+" },
  ],
  cleanliness: [
    { value: "very-clean", label: "Very clean" },
    { value: "clean", label: "Clean" },
    { value: "moderate", label: "Moderate" },
    { value: "relaxed", label: "Relaxed" },
  ],
  sleep: [
    { value: "early", label: "Early sleeper" },
    { value: "normal", label: "Normal" },
    { value: "late", label: "Late sleeper" },
  ],
  social: [
    { value: "quiet", label: "Quiet" },
    { value: "balanced", label: "Balanced" },
    { value: "social", label: "Social" },
  ],
  smoking: [
    { value: "never", label: "Never" },
    { value: "occasionally", label: "Occasionally" },
    { value: "regularly", label: "Regularly" },
  ],
  alcohol: [
    { value: "never", label: "Never" },
    { value: "occasionally", label: "Occasionally" },
    { value: "regularly", label: "Regularly" },
  ],
  noise: [
    { value: "need-quiet", label: "I need quiet to study / sleep" },
    { value: "some-noise", label: "Some noise is fine" },
    { value: "any-noise", label: "Music / TV / calls don't bother me" },
  ],
  guests: [
    { value: "rarely", label: "Rarely (a few times a month)" },
    { value: "sometimes", label: "Sometimes (about weekly)" },
    { value: "often", label: "Often (several times a week)" },
  ],
  food: [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "eggetarian", label: "Eggetarian" },
    { value: "non-vegetarian", label: "Non-vegetarian" },
  ],
  roomType: [
    { value: "private", label: "Private room" },
    { value: "sharing-2", label: "Sharing with 1 person" },
    { value: "sharing-3", label: "Sharing with 2+ people" },
  ],
  conflict: [
    { value: "talk-now", label: "Talk it out right away" },
    { value: "cool-off", label: "Cool off first, then talk" },
    { value: "avoid", label: "Avoid confrontation" },
  ],
} as const;

export type OptionField = keyof typeof OPTIONS;

export const CITIES = [
  "Hyderabad",
  "Bengaluru",
  "Chennai",
  "Pune",
  "Mumbai",
  "Delhi",
] as const;

export const HOBBIES = [
  "Music",
  "Gaming",
  "Cooking",
  "Sports",
  "Reading",
  "Movies",
  "Travel",
  "Fitness",
  "Art",
  "Coding",
] as const;

export function labelFor(field: OptionField, value: string): string {
  return OPTIONS[field].find((o) => o.value === value)?.label ?? value;
}

export const REPORT_REASONS = [
  { value: "fake-info", label: "Profile information is fake" },
  { value: "mismatch", label: "Lifestyle doesn't match their profile" },
  { value: "harassment", label: "Harassment or inappropriate behaviour" },
  { value: "spam", label: "Spam or scam" },
  { value: "other", label: "Other" },
] as const;

// ---- Business rules (change these numbers to change app behaviour) ----

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "nonbinary", label: "Nonbinary" },
] as const;

/** Chat requires a compatibility score strictly above this percentage. */
export const CHAT_THRESHOLD = 80;

export function canMessage(compatibility: number): boolean {
  return compatibility > CHAT_THRESHOLD;
}

/** A profile with this many different reporters is hidden from matches. */
export const REPORT_HIDE_THRESHOLD = 3;
