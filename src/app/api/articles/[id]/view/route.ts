import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    select: { id: true },
  });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const country = request.headers.get("x-vercel-ip-country") ?? null;
  const region = request.headers.get("x-vercel-ip-region") ?? null;
  const city = request.headers.get("x-vercel-ip-city") ?? null;

  await prisma.articleView.create({
    data: { articleId: params.id, country, region, city },
  });

  return NextResponse.json({ ok: true });
}
