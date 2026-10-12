"use client";
import { useState } from "react";
import { ClientInput } from "@/types";
import { inputCls } from "@/lib/styles";

type Props = {
  onSubmit: (input: ClientInput) => Promise<void>;
  onCancel: () => void;
};

const emptyForm = { name: "", company: "", email: "", phone: "", tags: "" };

export default function ClientForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      await onSubmit({
        name: form.name,
        company: form.company || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        tags: tags.length ? tags : undefined,
      });
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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
          onClick={onCancel}
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
  );
}
