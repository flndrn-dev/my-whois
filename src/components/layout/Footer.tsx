import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-border)] mt-16">
      <div className="container-content py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
        <div className="flex items-center gap-1.5">
          <span>© {year} my-whois.com by</span>
          <Image
            src="/flndrn-icon.svg"
            alt="flndrn"
            width={24}
            height={24}
            className="size-6 inline-block align-middle"
          />
          <span>flndrn</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/privacy"
            className="hover:text-[var(--color-foreground)] transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-[var(--color-border)]">|</span>
          <Link
            href="/terms"
            className="hover:text-[var(--color-foreground)] transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
