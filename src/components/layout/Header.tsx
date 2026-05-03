import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
  { href: "/bulk", label: "Bulk" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container-content h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          aria-label="my whois — home"
        >
          <span className="hidden sm:block">
            <Image
              src="/logo_light.svg"
              alt="my whois"
              width={140}
              height={40}
              className="hidden dark:block h-8 md:h-10 w-auto"
              priority
            />
            <Image
              src="/logo.svg"
              alt="my whois"
              width={140}
              height={40}
              className="block dark:hidden h-8 md:h-10 w-auto"
              priority
            />
          </span>
          <span className="sm:hidden">
            <Image
              src="/icon_light.svg"
              alt="my whois"
              width={40}
              height={40}
              className="hidden dark:block h-8 w-auto"
              priority
            />
            <Image
              src="/icon.svg"
              alt="my whois"
              width={40}
              height={40}
              className="block dark:hidden h-8 w-auto"
              priority
            />
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop nav — all four links visible together at md+. */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-5 text-sm text-muted"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <ThemeSwitcher />

          {/* Mobile hamburger — < md only. Same four links inside a sheet. */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
