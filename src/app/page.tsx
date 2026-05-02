import { DomainInput } from "@/components/lookup/DomainInput";
import { VisitorIp } from "@/components/lookup/VisitorIp";
import { AboutSection } from "@/components/content/AboutSection";
import { PopularDomains } from "@/components/content/PopularDomains";
import { ComparisonShowcase } from "@/components/content/ComparisonShowcase";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";
import { FadeIn } from "@/components/ui/FadeIn";

export default function HomePage() {
  return (
    <PageWithSideAds wide>
      <section className="text-center">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            domain inspector
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Look up any domain&rsquo;s
            <span className="block text-accent">
              age, health, and tech stack.
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted max-w-2xl mx-auto">
            One page. Live age counter, transparent health score, side-by-side
            comparisons, and the vendors behind any name. Free and unlimited —
            works for <span className="font-mono">.com</span>,{" "}
            <span className="font-mono">.io</span>,{" "}
            <span className="font-mono">.sh</span>,{" "}
            <span className="font-mono">.ai</span>, and 1,000+ more.
          </p>
        </FadeIn>
        <FadeIn delay={0.08} className="mt-8 flex justify-center">
          <DomainInput autoFocus />
        </FadeIn>
        <FadeIn delay={0.16}>
          <VisitorIp />
        </FadeIn>
      </section>

      <AboutSection />
      <PopularDomains />
      <ComparisonShowcase />
    </PageWithSideAds>
  );
}
