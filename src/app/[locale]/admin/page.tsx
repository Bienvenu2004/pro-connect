import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPendingProfessionals, getAllUsers } from "@/lib/actions/admin";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const t = await getTranslations();
  const [pendingPros, users] = await Promise.all([
    getPendingProfessionals(),
    getAllUsers(),
  ]);

  return (
    <AdminPanel
      pendingPros={JSON.parse(JSON.stringify(pendingPros))}
      users={JSON.parse(JSON.stringify(users))}
    />
  );
}
