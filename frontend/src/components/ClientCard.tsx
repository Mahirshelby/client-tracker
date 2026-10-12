import Link from "next/link";
import { Client } from "@/types";

type Props = {
  client: Client;
  onDelete: (client: Client) => void;
};

export default function ClientCard({ client, onDelete }: Props) {
  const details = [client.company, client.email].filter(Boolean).join(" - ");

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <Link
            href={`/clients/${client.id}`}
            className="block truncate font-medium text-slate-900 hover:text-indigo-600"
          >
            {client.name}
          </Link>
          <p className="truncate text-sm text-slate-500">{details || "No details yet"}</p>
          {client.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {client.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(client)}
        className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Delete
      </button>
    </li>
  );
}
