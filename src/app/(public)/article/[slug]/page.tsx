import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import ArticleBody from "@/components/public/ArticleBody";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!article) notFound();

  return (
    <>
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Badge className="bg-brand-red text-white mb-4">{article.category.name}</Badge>
        <h1 className="font-serif text-4xl font-bold leading-tight mb-4">{article.title}</h1>
        <p className="text-gray-500 text-sm mb-6">
          By {article.author.name} · {formatDate(article.publishedAt ?? article.createdAt)}
        </p>
        {article.coverImage && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
          </div>
        )}
        <ArticleBody html={article.body} />
      </main>
      <SiteFooter />
    </>
  );
}
