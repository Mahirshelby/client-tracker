"use client";
import Link from "next/link";

const stack = ["Next.js", "TypeScript", "Express", "PostgreSQL", "Prisma", "Tailwind CSS"];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M10 3l6 6-1.4 1.4L11 6.8V17H9V6.8L5.4 10.4 4 9l6-6z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 20 20" className="inline h-4 w-4 animate-pulse fill-rose-500" aria-hidden="true">
      <path d="M10 17.5l-1.45-1.32C4.4 12.36 2 10.18 2 7.5 2 5.32 3.7 3.6 5.9 3.6c1.24 0 2.43.58 3.1 1.5.67-.92 1.86-1.5 3.1-1.5 2.2 0 3.9 1.72 3.9 3.9 0 2.68-2.4 4.86-6.55 8.68L10 17.5z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-slate-950 text-slate-300">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-14">
        <div className="grid gap-10 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <div className="flex items-center gap-3 text-lg font-semibold text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white shadow-lg shadow-indigo-900/40">
                C
              </span>
              Client Tracker
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              A full-stack workspace to manage clients, notes and follow-ups. Secure per-user
              data, fast search and a clean API behind it.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-indigo-500/60 hover:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Explore
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/clients" className="text-slate-400 transition hover:text-white">
                  Clients
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 transition hover:text-white">
                  Log in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Developer
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="https://github.com/Mahirshelby/client-tracker"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 transition hover:text-white"
                >
                  Source code
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Mahirshelby"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 transition hover:text-white"
                >
                  GitHub profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 sm:flex-row">
          <div className="text-center text-xs text-slate-500 sm:text-left">
            <p>&copy; 2026 Client Tracker. All rights reserved.</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 sm:justify-start">
              Made with <HeartIcon /> by{" "}
              <span className="font-medium text-slate-300">Mahir Faisal Rahman</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Mahirshelby"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-indigo-500/60 hover:text-white"
            >
              <GitHubIcon />
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 text-xs font-medium text-slate-300 transition hover:border-indigo-500/60 hover:text-white"
            >
              Back to top
              <ArrowUpIcon />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
