import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import ArticleBody from "@/components/public/ArticleBody";
import ViewTracker from "@/components/public/ViewTracker";
import VoteBar from "@/components/public/VoteBar";
import CommentSection from "@/components/public/CommentSection";
import TweetEmbed from "@/components/public/TweetEmbed";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { extractTweetId } from "@/lib/extractTweetId";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true, coverImage: true, seoKeywords: true },
  });
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.seoKeywords ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      ...(article.coverImage && { images: [{ url: article.coverImage }] }),
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!article) notFound();

  const voteRows = await prisma.vote.groupBy({
    by: ["voteType"],
    where: { articleId: article.id },
    _count: { id: true },
  });
  const initialUp = voteRows.find((r) => r.voteType === "UP")?._count.id ?? 0;
  const initialDown = voteRows.find((r) => r.voteType === "DOWN")?._count.id ?? 0;

  const tweetId = article.twitterUrl ? extractTweetId(article.twitterUrl) : null;
  const byline = article.reporterName ?? article.author.name;

  return (
    <>
      <SiteHeader />
      <ViewTracker articleId={article.id} />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {(article as any).isBreaking && (
            <span className="bg-brand-red text-white text-[11px] font-black px-2 py-0.5 rounded tracking-widest uppercase animate-pulse">
              Breaking
            </span>
          )}
          <Badge className="bg-brand-red text-white">{article.category.name}</Badge>
        </div>
        <h1 className="font-serif text-4xl font-bold leading-tight mb-2">{article.title}</h1>
        {(article as any).subtitle && (
          <p className="font-serif text-xl text-gray-500 mb-4 leading-snug">
            {(article as any).subtitle}
          </p>
        )}
        <p className="text-gray-500 text-sm mb-3">
          {(article as any).dateline && (
            <span className="font-semibold text-gray-700 uppercase tracking-wide">
              {(article as any).dateline} —{" "}
            </span>
          )}
          Reported by {byline} · {formatDate(article.publishedAt ?? article.createdAt)}
        </p>
        <VoteBar articleId={article.id} initialUp={initialUp} initialDown={initialDown} />
        {article.coverImage && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
          </div>
        )}
        <ArticleBody html={article.body} />
        {tweetId && (
          <Suspense fallback={<div className="h-32 my-6 bg-gray-100 animate-pulse rounded-lg" />}>
            <TweetEmbed tweetId={tweetId} />
          </Suspense>
        )}
        <CommentSection articleId={article.id} />
      </main>
      <SiteFooter />
    </>
  );
}
