import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import ArticleGrid from "@/components/public/ArticleGrid";
import type { ArticleWithRelations } from "@/types";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId: category.id },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  return (
    <>
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl font-bold mb-8">{category.name}</h1>
        <ArticleGrid articles={articles as ArticleWithRelations[]} />
      </main>
      <SiteFooter />
    </>
  );
}
