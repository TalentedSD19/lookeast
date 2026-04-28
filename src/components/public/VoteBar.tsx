"use client";

import { useEffect, useState } from "react";

interface Props {
  articleId: string;
  initialUp: number;
  initialDown: number;
}

function getOrCreateToken(): string {
  const key = "lookeast_voter_token";
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

export default function VoteBar({ articleId, initialUp, initialDown }: Props) {
  const [counts, setCounts] = useState({ up: initialUp, down: initialDown });
  const [userVote, setUserVote] = useState<"UP" | "DOWN" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getOrCreateToken();
    fetch(`/api/articles/${articleId}/votes?voterToken=${token}`)
      .then((r) => r.json())
      .then((data) => {
        setCounts({ up: data.up, down: data.down });
        setUserVote(data.userVote);
      });
  }, [articleId]);

  async function vote(type: "UP" | "DOWN") {
    if (loading) return;
    setLoading(true);
    const token = getOrCreateToken();
    const res = await fetch(`/api/articles/${articleId}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterToken: token, voteType: type }),
    });
    const data = await res.json();
    setCounts({ up: data.up, down: data.down });
    setUserVote(data.userVote);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-4 my-4">
      <button
        onClick={() => vote("UP")}
        disabled={loading}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
          userVote === "UP"
            ? "bg-green-600 text-white border-green-600"
            : "bg-white text-gray-700 border-gray-300 hover:border-green-500 hover:text-green-600"
        }`}
      >
        <span>▲</span>
        <span>{counts.up}</span>
      </button>
      <button
        onClick={() => vote("DOWN")}
        disabled={loading}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
          userVote === "DOWN"
            ? "bg-red-600 text-white border-red-600"
            : "bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-600"
        }`}
      >
        <span>▼</span>
        <span>{counts.down}</span>
      </button>
    </div>
  );
}
