"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, clearToken } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    api<{ email: string }>("/auth/me")
      .then((u) => setEmail(u.email))
      .catch(() => {});
  }, []);

  function logout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/clients" className="flex items-center gap-3 font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-900/40">
            C
          </span>
          Client Tracker
        </Link>
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900 py-1 pl-1 pr-3 text-sm text-slate-300 sm:flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {email.charAt(0).toUpperCase()}
              </span>
              {email}
            </span>
          )}
          <button
            onClick={logout}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Log out
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
    </header>
  );
}
