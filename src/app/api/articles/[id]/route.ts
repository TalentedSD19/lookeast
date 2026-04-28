import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug: slugInput, excerpt, body: content, coverImage, categoryId, status, reporterName, twitterUrl } = body;

  const existing = await prisma.article.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let slug = existing.slug;
  const desiredSlug = slugInput || (title ? slugify(title) : null);
  if (desiredSlug && desiredSlug !== existing.slug) {
    slug = desiredSlug;
    let suffix = 1;
    while (await prisma.article.findFirst({ where: { slug, NOT: { id: params.id } } })) {
      slug = `${desiredSlug}-${suffix++}`;
    }
  }

  const nowPublishing = status === "PUBLISHED" && existing.status !== "PUBLISHED";

  const article = await prisma.article.update({
    where: { id: params.id },
    data: {
      ...(title && { title }),
      slug,
      ...(excerpt && { excerpt }),
      ...(content && { body: content }),
      ...(coverImage !== undefined && { coverImage }),
      ...(categoryId && { categoryId }),
      ...(status && { status }),
      ...(nowPublishing && { publishedAt: new Date() }),
      ...(reporterName !== undefined && { reporterName: reporterName || null }),
      ...(twitterUrl !== undefined && { twitterUrl: twitterUrl || null }),
    },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  return NextResponse.json(article);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.article.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
