import { Article, User, Category, ArticleStatus, Comment, VoteType } from "@prisma/client";

export type ArticleWithRelations = Article & {
  author: Pick<User, "id" | "name">;
  category: Pick<Category, "id" | "name" | "slug">;
};

export type VoteCounts = {
  up: number;
  down: number;
  userVote: VoteType | null;
};

export type GeoBreakdown = {
  country: string | null;
  region: string | null;
  _count: { id: number };
}[];

export type { ArticleStatus, Comment, VoteType };
