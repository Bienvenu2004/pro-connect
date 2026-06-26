import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { ProDashboard } from "@/components/dashboard/pro-dashboard";

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function DashboardPage() {
  const session = await auth();
  const { user } = session!;

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  if (user.role === "PROFESSIONAL") {
    const profile = await prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    let jobs: any[] = [];

    if (profile && profile.isAvailable && profile.verificationStatus === "APPROVED") {
      const allJobs = await prisma.jobRequest.findMany({
        where: { category: profile.category, status: "OPEN" },
        include: {
          client: { select: { name: true } },
          contacts: { where: { proId: profile.id } },
        },
        orderBy: { createdAt: "desc" },
      });

      if (profile.latitude && profile.longitude) {
        jobs = allJobs.filter((job) =>
          haversineDistance(
            profile.latitude!,
            profile.longitude!,
            job.latitude,
            job.longitude
          ) <= profile.serviceRadiusKm
        );
      } else {
        jobs = allJobs;
      }
    }

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
