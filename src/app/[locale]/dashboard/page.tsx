import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations("nav");

  if (!session?.user) {
    redirect("/auth/login");
  }

  const { user } = session;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">{t("dashboard")}</h1>
      <p className="mt-4 text-gray-600">
        Welcome back, <span className="font-medium">{user.name}</span>.
      </p>
      <div className="mt-6 rounded-lg border bg-white p-6">
        <p className="text-sm text-gray-500">
          Role: <span className="font-medium text-gray-900">{user.role}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Email: <span className="font-medium text-gray-900">{user.email}</span>
        </p>
      </div>
    </div>
  );
}
