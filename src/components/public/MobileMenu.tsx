"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";

type Category = { id: string; name: string; slug: string };

export default function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-brand-dark border-t border-white/10 px-4 py-4 space-y-3 shadow-lg z-50">
          <SearchBar wide />
          <nav className="space-y-0.5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                pathname === "/"
                  ? "text-brand-red bg-white/5"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              All Articles
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  pathname === `/category/${cat.slug}`
                    ? "text-brand-red bg-white/5"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                pathname === "/about"
                  ? "text-brand-red bg-white/5"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
