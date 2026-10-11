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
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/clients" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            C
          </span>
          Client Tracker
        </Link>
        <div className="flex items-center gap-4">
          {email && <span className="hidden text-sm text-slate-500 sm:block">{email}</span>}
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
