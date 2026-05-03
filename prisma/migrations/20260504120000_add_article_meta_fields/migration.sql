-- AlterTable
ALTER TABLE "Article" ADD COLUMN "subtitle"   TEXT;
ALTER TABLE "Article" ADD COLUMN "dateline"   TEXT;
ALTER TABLE "Article" ADD COLUMN "isBreaking" BOOLEAN NOT NULL DEFAULT false;
