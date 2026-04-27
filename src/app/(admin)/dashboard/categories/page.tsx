import { prisma } from "@/lib/prisma";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">Categories</h1>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
