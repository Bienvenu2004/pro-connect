import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { ProDashboard } from "@/components/dashboard/pro-dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const t = await getTranslations();
  const { user } = session;

  if (user.role === "PROFESSIONAL") {
    const profile = await prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    const jobs =
      profile && profile.isAvailable && profile.verificationStatus === "APPROVED"
        ? await prisma.jobRequest.findMany({
            where: { category: profile.category, status: "OPEN" },
            include: {
              client: { select: { name: true } },
              contacts: { where: { proId: profile.id } },
            },
            orderBy: { createdAt: "desc" },
          })
        : [];

    return (
      <ProDashboard
        profile={profile ? JSON.parse(JSON.stringify(profile)) : null}
        jobs={JSON.parse(JSON.stringify(jobs))}
        userName={user.name}
      />
    );
  }

  const jobs = await prisma.jobRequest.findMany({
    where: { clientId: user.id },
    include: {
      contacts: {
        include: {
          pro: {
            include: { user: { select: { name: true, email: true } } },
          },
        },
      },
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ClientDashboard
      jobs={JSON.parse(JSON.stringify(jobs))}
      userName={user.name}
    />
  );
}
