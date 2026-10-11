"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api<{ token: string }>(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token);
      router.push("/clients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 font-bold">C</span>
          Client Tracker
        </div>
        <div>
          <h2 className="text-4xl font-semibold leading-tight">
            Keep every client
            <br />
            and task in one place.
          </h2>
          <p className="mt-4 max-w-md text-indigo-100">
            Track contacts, notes and follow-ups with a fast, searchable workspace built with Next.js,
            Express and PostgreSQL.
          </p>
        </div>
        <p className="text-sm text-indigo-200">Secure JWT auth. Your data stays private to your account.</p>
      </section>

      <section className="flex items-center justify-center bg-white p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "login" ? "Log in to manage your clients." : "It takes less than a minute."}
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>

          <p className="text-center text-sm text-slate-500">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="font-medium text-indigo-600 hover:underline"
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}
