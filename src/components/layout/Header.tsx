import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";

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
        <nav className="flex items-center gap-4 text-sm text-muted">
          <Link
            href="/watchlist"
            className="hover:text-foreground transition-colors hidden md:inline"
          >
            Watchlist
          </Link>
          <Link
            href="/blog"
            className="hover:text-foreground transition-colors hidden sm:inline"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="hover:text-foreground transition-colors hidden sm:inline"
          >
            About
          </Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
