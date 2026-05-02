import { DomainInput } from "@/components/lookup/DomainInput";
import { VisitorIp } from "@/components/lookup/VisitorIp";
import { AboutSection } from "@/components/content/AboutSection";
import { PopularDomains } from "@/components/content/PopularDomains";
import { ComparisonShowcase } from "@/components/content/ComparisonShowcase";
import { PageWithSideAds } from "@/components/layout/PageWithSideAds";
import { ContentBreakAd } from "@/components/layout/ContentBreakAd";
import { FadeIn } from "@/components/ui/FadeIn";

export default function HomePage() {
  return (
    <PageWithSideAds wide>
      <section className="text-center pt-4 sm:pt-8">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            <span className="text-accent">●</span> Domain inspector — live
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-[5.5rem] font-bold tracking-tight leading-[1.02]">
            Look up any domain&rsquo;s
            <span className="block">
              <span className="font-editorial italic font-normal text-accent tracking-[-0.005em]">
                age, health,
              </span>{" "}
              <span className="font-editorial italic font-normal text-accent tracking-[-0.005em]">
                &amp; tech stack.
              </span>
            </span>
          </h1>
          <p className="mt-6 font-prose text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            One page. Live age counter, transparent health score, side-by-side
            comparisons, and the vendors behind any name. Free and unlimited —
            works for <span className="font-mono text-foreground">.com</span>,{" "}
            <span className="font-mono text-foreground">.io</span>,{" "}
            <span className="font-mono text-foreground">.sh</span>,{" "}
            <span className="font-mono text-foreground">.ai</span>, and 1,000+
            more.
          </p>
        </FadeIn>
        <FadeIn delay={0.08} className="mt-10 flex justify-center">
          <DomainInput autoFocus />
        </FadeIn>
        <FadeIn delay={0.16}>
          <VisitorIp />
        </FadeIn>
      </section>

      <AboutSection />

      <ContentBreakAd />

      <PopularDomains />
      <ComparisonShowcase />
    </PageWithSideAds>
  );
}
