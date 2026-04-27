"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };

export default function CategoryNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2">
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-brand-red",
          pathname === "/" ? "text-brand-red" : "text-gray-300"
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className={cn(
            "text-sm font-medium transition-colors hover:text-brand-red",
            pathname === `/category/${cat.slug}` ? "text-brand-red" : "text-gray-300"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}
