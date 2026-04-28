"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  currentStatus: "DRAFT" | "PUBLISHED";
}

export default function PublishToggleButton({ id, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  const isPublished = currentStatus === "PUBLISHED";

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={loading}
      onClick={handleToggle}
      className={
        isPublished
          ? "border-amber-400 text-amber-600 hover:bg-amber-50"
          : "border-green-500 text-green-600 hover:bg-green-50"
      }
    >
      {loading ? "…" : isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}
