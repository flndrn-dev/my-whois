import { Info } from "@/components/ui/icons";

export function RedactionNotice({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-surface/60 p-4 text-sm">
      <div className="flex gap-2 items-start">
        <Info className="size-4 mt-0.5 text-muted shrink-0" />
        <ul className="space-y-1 text-muted">
          {notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
