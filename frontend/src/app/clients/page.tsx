"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientCard from "@/components/ClientCard";
import ClientForm from "@/components/ClientForm";
import Pagination from "@/components/Pagination";
import { api, clearToken, getToken } from "@/lib/api";
import { inputCls } from "@/lib/styles";
import { Client, ClientInput, ClientList } from "@/types";

export default function ClientsPage() {
  const router = useRouter();
  const [data, setData] = useState<ClientList | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
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

  async function addClient(input: ClientInput) {
    setError("");
    try {
      await api("/clients", { method: "POST", body: JSON.stringify(input) });
      setShowForm(false);
      setPage(1);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add client");
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-200">Your workspace</p>
            <h1 className="mt-1 text-3xl font-semibold text-white">Clients</h1>
            <p className="mt-2 max-w-md text-sm text-indigo-100">
              Keep every contact, note and follow-up in one place.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-center backdrop-blur">
              <p className="text-2xl font-semibold text-white">{data ? data.total : "-"}</p>
              <p className="text-xs text-indigo-100">
                {data && data.total === 1 ? "client" : "clients"}
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
            >
              {showForm ? "Close" : "+ Add client"}
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-8">
        {showForm && <ClientForm onSubmit={addClient} onCancel={() => setShowForm(false)} />}

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
            <ClientCard key={c.id} client={c} onDelete={removeClient} />
          ))}
        </ul>

        {data && <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />}
      </main>

      <Footer />
    </div>
  );
}
