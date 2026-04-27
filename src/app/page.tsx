import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import ArticleGrid from "@/components/public/ArticleGrid";
import type { ArticleWithRelations } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 12,
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1 w-full px-6 py-10">
        <ArticleGrid articles={articles as ArticleWithRelations[]} />
      </main>
      <SiteFooter />
    </>
  );
}
