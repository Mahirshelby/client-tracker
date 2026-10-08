"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, clearToken, getToken } from "@/lib/api";

type Client = { id: number; name: string; company: string | null; email: string | null };
type ClientList = { items: Client[]; total: number; page: number; totalPages: number };

export default function ClientsPage() {
  const router = useRouter();
  const [data, setData] = useState<ClientList | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<ClientList>(
        `/clients?search=${encodeURIComponent(search)}&page=${page}&limit=5`
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
  }, [search, page, router]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    load();
  }, [load, router]);

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/clients", {
        method: "POST",
        body: JSON.stringify({ name, company: company || undefined }),
      });
      setName("");
      setCompany("");
      setPage(1);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add client");
    }
  }

  async function removeClient(id: number) {
    try {
      await api(`/clients/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  function logout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <button onClick={logout} className="text-sm text-blue-600">Log out</button>
      </div>

      <form onSubmit={addClient} className="flex gap-2">
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
        />
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="flex-1 border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
        />
        <button className="bg-blue-600 text-white rounded px-4">Add</button>
      </form>

      <input
        placeholder="Search by name or company"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && !data && <p className="text-gray-500">Loading...</p>}

      <ul className="space-y-2">
        {data?.items.map((c) => (
          <li key={c.id} className="flex items-center justify-between border rounded px-4 py-3">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">{c.company ?? "No company"}</p>
            </div>
            <button onClick={() => removeClient(c.id)} className="text-sm text-red-600">
              Delete
            </button>
          </li>
        ))}
        {data && data.items.length === 0 && <p className="text-gray-500">No clients found.</p>}
      </ul>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="border rounded px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {data.page} of {data.totalPages}
          </span>
          <button
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
            className="border rounded px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
