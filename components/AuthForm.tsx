"use client";

import { useState } from "react";

// One form for both "Login" and "Register" (toggle at the bottom).
export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      // full reload so the server sees the new cookie everywhere
      window.location.href = data.redirect;
    } catch {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
        {isLogin ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        {isLogin
          ? "Log in to see your roommate matches."
          : "Register with your email and create a password."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-line bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isLogin ? "Your password" : "At least 6 characters"}
            className="w-full rounded-md border border-line bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "Please wait..." : isLogin ? "Log in" : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {isLogin ? "New here?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(isLogin ? "register" : "login");
            setError("");
          }}
          className="font-medium text-primary hover:underline"
        >
          {isLogin ? "Register" : "Log in"}
        </button>
      </p>
    </div>
  );
}
