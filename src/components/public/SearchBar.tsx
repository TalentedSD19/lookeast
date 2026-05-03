"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type SearchResult = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string | null;
  category: { name: string; slug: string };
};

export default function SearchBar({ wide = false }: { wide?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside, but not when clicking inside (including results)
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error("Search failed");
        const data: SearchResult[] = await res.json();
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  function clear() {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className={`flex items-center bg-white/10 border border-white/20 rounded-md px-3 py-1.5 gap-2 focus-within:bg-white/15 focus-within:border-white/40 transition-colors ${wide ? "w-full" : "w-52"}`}>
        <Search size={14} className="text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search articles…"
          className="bg-transparent text-white text-sm placeholder-gray-400 outline-none w-full min-w-0"
        />
        {query && (
          <button
            type="button"
            onPointerDown={(e) => e.preventDefault()} // prevent input blur before clear runs
            onClick={clear}
            className="text-gray-400 hover:text-white transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className={`absolute top-full mt-2 bg-white rounded-md shadow-xl ring-1 ring-black/10 z-50 overflow-hidden ${wide ? "left-0 right-0" : "right-0 w-80"}`}>
          {loading ? (
            <p className="px-4 py-3 text-sm text-gray-500">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">
              No articles found for &ldquo;{query.trim()}&rdquo;.
            </p>
          ) : (
            <ul>
              {results.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/article/${article.slug}`}
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                      setOpen(false);
                    }}
                    className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt=""
                        width={56}
                        height={40}
                        className="rounded object-cover shrink-0 self-start mt-0.5"
                      />
                    ) : (
                      <div className="w-14 h-10 rounded bg-gray-100 shrink-0 self-start mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-brand-red mb-0.5">
                        {article.category.name}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
