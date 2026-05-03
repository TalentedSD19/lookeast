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
      <main className="flex-1 w-full">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 mb-2">Category</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950">{category.name}</h1>
            <div className="w-8 h-0.5 bg-brand-red mt-3" />
          </div>
          <ArticleGrid articles={articles as ArticleWithRelations[]} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
