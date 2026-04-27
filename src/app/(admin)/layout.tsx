import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, avatarUrl: true },
      })
    : null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        userName={user?.name ?? session?.user?.name ?? "Admin"}
        avatarUrl={user?.avatarUrl ?? null}
      />
      <div className="flex-1 bg-gray-50 p-8 overflow-auto">{children}</div>
    </div>
  );
}
