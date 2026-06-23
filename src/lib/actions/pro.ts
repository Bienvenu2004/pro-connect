"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleAvailability() {
  const session = await auth();
  if (!session?.user) return { error: "unauthorized" };

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) return { error: "noProfile" };

  const updated = await prisma.professionalProfile.update({
    where: { id: profile.id },
    data: { isAvailable: !profile.isAvailable },
  });

  return { success: true, isAvailable: updated.isAvailable };
}

export async function getProProfile() {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: { select: { name: true, email: true } },
      reviewsReceived: {
        select: { rating: true },
      },
    },
  });
}

export async function getProDashboardData() {
  const session = await auth();
  if (!session?.user) return null;

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile || !profile.isAvailable) return { profile, jobs: [] };

  const jobs = await prisma.jobRequest.findMany({
    where: {
      category: profile.category,
      status: "OPEN",
    },
    include: {
      client: { select: { name: true } },
      contacts: {
        where: { proId: profile.id },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { profile, jobs };
}
