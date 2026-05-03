"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUploader from "./ImageUploader";
import { slugify } from "@/lib/utils";
import type { ArticleWithRelations } from "@/types";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

type Category = { id: string; name: string; slug: string };

interface Props {
  article?: ArticleWithRelations;
  categories: Category[];
}

export default function ArticleForm({ article, categories }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [reporterName, setReporterName] = useState(article?.reporterName ?? "");
  const [seoKeywords, setSeoKeywords] = useState(article?.seoKeywords ?? "");
  const [keywordInput, setKeywordInput] = useState("");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [body, setBody] = useState(article?.body ?? "");
  const [coverImage, setCoverImage] = useState(article?.coverImage ?? "");
  const [categoryId, setCategoryId] = useState(article?.categoryId ?? "");
  const [twitterUrl, setTwitterUrl] = useState(article?.twitterUrl ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(article?.status ?? "DRAFT");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!article) setSlug(slugify(title));
  }, [title, article]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { title, slug, reporterName, excerpt, body, coverImage, categoryId, twitterUrl, seoKeywords, status };
    const url = article ? `/api/articles/${article.id}` : "/api/articles";
    const method = article ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
    } else {
      router.push("/dashboard/articles");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="reporterName">Reporter Name</Label>
        <Input
          id="reporterName"
          value={reporterName}
          onChange={(e) => setReporterName(e.target.value)}
          placeholder="e.g. Rina Chowdhury"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="seoKeywords">SEO Keywords</Label>
        <div className="flex gap-2">
          <Input
            id="seoKeywords"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                const kw = keywordInput.trim().replace(/,$/, "");
                if (!kw) return;
                const existing = seoKeywords ? seoKeywords.split(",").map((k) => k.trim()) : [];
                if (!existing.includes(kw)) setSeoKeywords([...existing, kw].join(","));
                setKeywordInput("");
              }
            }}
            placeholder="Type a keyword and press Enter"
          />
          <button
            type="button"
            onClick={() => {
              const kw = keywordInput.trim();
              if (!kw) return;
              const existing = seoKeywords ? seoKeywords.split(",").map((k) => k.trim()) : [];
              if (!existing.includes(kw)) setSeoKeywords([...existing, kw].join(","));
              setKeywordInput("");
            }}
            className="shrink-0 px-3 py-1 text-sm rounded-md border border-input bg-transparent hover:bg-gray-50"
          >
            Add
          </button>
        </div>
        {seoKeywords && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {seoKeywords.split(",").map((kw) => kw.trim()).filter(Boolean).map((kw) => (
              <span key={kw} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-700">
                {kw}
                <button
                  type="button"
                  onClick={() => setSeoKeywords(seoKeywords.split(",").map((k) => k.trim()).filter((k) => k && k !== kw).join(","))}
                  className="text-gray-400 hover:text-gray-700 leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400">Keywords help search engines understand what this article is about.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <ImageUploader value={coverImage} onChange={setCoverImage} />

      <div className="space-y-1">
        <Label>Body</Label>
        <RichTextEditor value={body} onChange={setBody} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="twitterUrl">Twitter / X Post URL (optional)</Label>
        <Input
          id="twitterUrl"
          type="url"
          value={twitterUrl}
          onChange={(e) => setTwitterUrl(e.target.value)}
          placeholder="https://twitter.com/user/status/..."
        />
        <p className="text-xs text-gray-400">Paste a tweet URL to embed it inside the article.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-brand-red hover:bg-brand-red/90 text-white">
          {saving ? "Saving…" : article ? "Update Article" : "Create Article"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
