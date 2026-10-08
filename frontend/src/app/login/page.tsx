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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4">
        <h1 className="text-2xl font-semibold bg-white text-gray-900 placeholder-gray-400">
          {mode === "login" ? "Log in" : "Create account"}
        </h1>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Register"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full text-sm text-blue-600"
        >
          {mode === "login" ? "No account? Register" : "Have an account? Log in"}
        </button>
      </form>
    </main>
  );
}
