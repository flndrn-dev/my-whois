import { Info } from "lucide-react";

export function RedactionNotice({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 text-sm">
      <div className="flex gap-2 items-start">
        <Info className="size-4 mt-0.5 text-[var(--color-muted)] shrink-0" />
        <ul className="space-y-1 text-[var(--color-muted)]">
          {notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
