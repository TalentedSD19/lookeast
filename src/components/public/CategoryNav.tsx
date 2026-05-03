"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };

export default function CategoryNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    cn(
      "px-3 py-3 text-[0.8rem] font-sans font-medium whitespace-nowrap border-b-2 transition-colors duration-150 tracking-wide",
      active
        ? "border-brand-red text-brand-red"
        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
    );

  return (
    <nav className="flex items-center overflow-x-auto scrollbar-hide -mb-px">
      <Link href="/" className={linkClass(pathname === "/")}>
        Home
      </Link>

      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className={linkClass(pathname === `/category/${cat.slug}`)}
        >
          {cat.name}
        </Link>
      ))}

      <Link href="/about" className={linkClass(pathname === "/about")}>
        About
      </Link>
    </nav>
  );
}
