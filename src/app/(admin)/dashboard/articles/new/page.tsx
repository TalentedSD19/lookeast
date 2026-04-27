import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">New Article</h1>
      <ArticleForm categories={categories} />
    </div>
  );
}
