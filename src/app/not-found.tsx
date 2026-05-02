import Link from "next/link";
import { DomainInput } from "@/components/lookup/DomainInput";

export default function NotFound() {
  return (
    <div className="container-content py-16 sm:py-24 text-center max-w-2xl mx-auto">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight">
        We couldn&rsquo;t resolve that.
      </h1>
      <p className="mt-4 text-[var(--color-muted)]">
        The domain may not exist, the registry didn&rsquo;t respond, or the
        URL was malformed. Try another one below, or head{" "}
        <Link href="/" className="underline">
          back home
        </Link>
        .
      </p>
      <div className="mt-8 flex justify-center">
        <DomainInput size="default" />
      </div>
    </div>
  );
}
