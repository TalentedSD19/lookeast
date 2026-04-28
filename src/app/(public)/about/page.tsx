import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl font-bold mb-6">About LookEast</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          LookEast is an independent news publication covering stories from the East —
          politics, economy, society, culture, and the environment. We are committed to
          accurate, in-depth journalism that brings regional perspectives to a wider audience.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
