"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type Category = { id: string; name: string; slug: string };

export default function CategoryNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeCategory = categories.find((c) => pathname === `/category/${c.slug}`);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center gap-6">
      {/* Categories dropdown */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-red",
            activeCategory ? "text-brand-red" : "text-gray-300"
          )}
        >
          {activeCategory ? activeCategory.name : "Categories"}
          <ChevronDown
            size={14}
            className={cn("transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black/5 py-1 z-50">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2 text-sm transition-colors hover:bg-gray-50",
                pathname === "/" ? "text-brand-red font-medium" : "text-gray-700"
              )}
            >
              All
            </Link>
            <div className="border-t my-1" />
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-2 text-sm transition-colors hover:bg-gray-50",
                  pathname === `/category/${cat.slug}`
                    ? "text-brand-red font-medium"
                    : "text-gray-700"
                )}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* About */}
      <Link
        href="/about"
        className={cn(
          "text-sm font-medium transition-colors hover:text-brand-red",
          pathname === "/about" ? "text-brand-red" : "text-gray-300"
        )}
      >
        About
      </Link>
    </nav>
  );
}
