"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DeleteArticleButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this article?")) return;
    setLoading(true);
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button variant="destructive" size="sm" disabled={loading} onClick={handleDelete}>
      {loading ? "…" : "Delete"}
    </Button>
  );
}
