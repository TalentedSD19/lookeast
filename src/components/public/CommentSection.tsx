"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/types";

export default function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/articles/${articleId}/comments`)
      .then((r) => r.json())
      .then(setComments);
  }, [articleId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName: name, body }),
    });

    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to post comment");
    } else {
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setName("");
      setBody("");
    }
  }

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="font-serif text-2xl font-bold mb-6">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <textarea
          placeholder="Leave a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          maxLength={2000}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded-md bg-brand-red text-white text-sm font-medium hover:bg-brand-red/90 disabled:opacity-50"
        >
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>

      <div className="space-y-6">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{c.authorName}</span>
              <span className="text-gray-400 text-xs">{formatDate(c.createdAt)}</span>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
