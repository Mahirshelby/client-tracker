"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api, clearToken, getToken } from "@/lib/api";

type Client = {
  id: number;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  tags: string[];
};
type ClientList = { items: Client[]; total: number; page: number; totalPages: number };

const emptyForm = { name: "", company: "", email: "", phone: "", tags: "" };
const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export default function ClientsPage() {
  const router = useRouter();
  const [data, setData] = useState<ClientList | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<ClientList>(
        `/clients?search=${encodeURIComponent(query)}&page=${page}&limit=6`
      );
      setData(res);
      setError("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error";
      if (msg.includes("token")) {
        clearToken();
        router.replace("/login");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [query, page, router]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      await api("/clients", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          company: form.company || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
          tags: tags.length ? tags : undefined,
        }),
      });
      setForm(emptyForm);
      setShowForm(false);
      setPage(1);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add client");
    } finally {
      setSaving(false);
    }
  }

  async function removeClient(c: Client) {
    if (!window.confirm(`Delete ${c.name}? This also deletes their tasks.`)) return;
    try {
      await api(`/clients/${c.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  const noClientsAtAll = data && data.total === 0 && !query;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Clients</h1>
            <p className="text-sm text-slate-500">
              {data ? `${data.total} ${data.total === 1 ? "client" : "clients"}` : "Loading..."}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            {showForm ? "Close" : "+ Add client"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={addClient}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="font-medium text-slate-900">New client</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
              <input
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputCls}
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls}
              />
            </div>
            <input
              placeholder="Tags (comma separated, e.g. lead, vip)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className={inputCls}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(emptyForm);
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save client"}
              </button>
            </div>
          </form>
        )}

        <input
          placeholder="Search by name or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputCls}
        />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {loading && !data && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        )}

        {noClientsAtAll && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center">
            <p className="font-medium text-slate-900">No clients yet</p>
            <p className="mt-1 text-sm text-slate-500">Add your first client to get started.</p>
          </div>
        )}

        {data && data.total === 0 && query && (
          <p className="py-8 text-center text-slate-500">No clients match &quot;{query}&quot;.</p>
        )}

        <ul className="space-y-3">
          {data?.items.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/clients/${c.id}`}
                    className="block truncate font-medium text-slate-900 hover:text-indigo-600"
                  >
                    {c.name}
                  </Link>
                  <p className="truncate text-sm text-slate-500">
                    {[c.company, c.email].filter(Boolean).join(" - ") || "No details yet"}
                  </p>
                  {c.tags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeClient(c)}
                className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {data.page} of {data.totalPages}
            </span>
            <button
              disabled={page >= data.totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
