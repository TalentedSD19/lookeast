"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({ articleId }: { articleId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch(`/api/articles/${articleId}/view`, { method: "POST" });
  }, [articleId]);

  return null;
}
