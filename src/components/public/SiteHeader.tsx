import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryNav from "./CategoryNav";

export default async function SiteHeader() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <header className="bg-brand-dark text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6 flex-wrap">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight hover:text-brand-red transition-colors">
          LookEast
        </Link>
        <CategoryNav categories={categories} />
      </div>
    </header>
  );
}
