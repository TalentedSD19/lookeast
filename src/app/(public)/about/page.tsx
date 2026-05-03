import type { Metadata } from "next";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";

export const metadata: Metadata = {
  title: "About — Eastern News Network",
  description: "Learn about Eastern News Network, an independent publication covering stories from the East.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 mb-4">About</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 text-gray-950 leading-tight">
            Eastern News Network
          </h1>
          <div className="w-10 h-0.5 bg-brand-red mb-8" />
          <div className="space-y-5 text-gray-600 text-lg leading-relaxed font-sans">
            <p>
              Eastern News Network (ENN) is an independent news publication covering stories from the East —
              politics, economy, society, culture, and the environment.
            </p>
            <p>
              We are committed to accurate, in-depth journalism that brings regional perspectives to a wider audience.
              Our reporters are embedded in communities across the region, delivering ground-level reporting that
              national outlets often miss.
            </p>
            <p>
              ENN is reader-supported and editorially independent. We do not accept funding from political parties
              or corporate interests that could compromise our coverage.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
