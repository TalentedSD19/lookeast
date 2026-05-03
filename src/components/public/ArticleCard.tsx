import Link from "next/link";
import Image from "next/image";
import { ArticleWithRelations } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ArticleCard({ article }: { article: ArticleWithRelations }) {
  return (
    <Link href={`/article/${article.slug}`} className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-4">
        <Badge className="bg-brand-red text-white mb-2 text-xs">{article.category.name}</Badge>
        <h2 className="font-serif font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">
          {article.title}
        </h2>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
        <div className="text-xs text-gray-400">
          {article.reporterName ?? article.author.name} · {formatDate(article.publishedAt ?? article.createdAt)}
        </div>
      </div>
    </Link>
  );
}
