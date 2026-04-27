import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/admin/ArticleForm";
import type { ArticleWithRelations } from "@/types";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">Edit Article</h1>
      <ArticleForm article={article as ArticleWithRelations} categories={categories} />
    </div>
  );
}
