"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VerificationStatus } from "@/generated/prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getPendingProfessionals() {
  await requireAdmin();

  return prisma.professionalProfile.findMany({
    where: { verificationStatus: "PENDING" },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
      documents: true,
    },
    orderBy: { user: { createdAt: "desc" } },
  });
}

export async function getAllUsers() {
  await requireAdmin();

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateVerificationStatus(
  profileId: string,
  status: VerificationStatus
) {
  await requireAdmin();

  await prisma.professionalProfile.update({
    where: { id: profileId },
    data: { verificationStatus: status },
  });

  return { success: true };
}

export async function toggleUserActive(userId: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "notFound" };

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  return { success: true, isActive: !user.isActive };
}
