import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import CategoryNav from "./CategoryNav";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";

export default async function SiteHeader() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } }).catch(() => []);

  return (
    <header className="bg-brand-dark text-white sticky top-0 z-50 shadow-md relative">
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
          <Image
            src="/android-chrome-192x192.png"
            alt="Eastern News Network"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <span className="font-serif font-bold tracking-tight">
            <span className="md:hidden text-xl">ENN</span>
            <span className="hidden md:inline text-xl lg:text-2xl">Eastern News Network</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <CategoryNav categories={categories} />
          <SearchBar />
        </div>

        {/* Mobile hamburger */}
        <MobileMenu categories={categories} />
      </div>
    </header>
  );
}
