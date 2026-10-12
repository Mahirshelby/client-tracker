export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>
          &copy; 2026 Client Tracker. Built by Mahir Faisal Rahman.
        </p>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Next.js, Express, PostgreSQL</span>
          <a
            href="https://github.com/Mahirshelby/client-tracker"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
