"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/articles", label: "Articles" },
  { href: "/dashboard/categories", label: "Categories" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-brand-dark text-white min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="font-serif text-xl font-bold hover:text-brand-red transition-colors">
          LookEast
        </Link>
        <p className="text-xs text-gray-400 mt-1">Admin</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname.startsWith(item.href)
                ? "bg-brand-red text-white"
                : "text-gray-300 hover:bg-white/10"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-white/10 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
