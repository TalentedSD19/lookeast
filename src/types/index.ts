import { Article, User, Category, ArticleStatus } from "@prisma/client";

export type ArticleWithRelations = Article & {
  author: Pick<User, "id" | "name">;
  category: Pick<Category, "id" | "name" | "slug">;
};

export type { ArticleStatus };
