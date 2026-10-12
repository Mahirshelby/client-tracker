type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
