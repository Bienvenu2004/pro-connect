"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface UpdateProProfileInput {
  bio?: string;
  latitude?: number;
  longitude?: number;
  serviceRadiusKm?: number;
}

export async function updateProProfile(input: UpdateProProfileInput) {
  const session = await auth();
  if (!session?.user) return { error: "unauthorized" };

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) return { error: "noProfile" };

  await prisma.professionalProfile.update({
    where: { id: profile.id },
    data: {
      bio: input.bio !== undefined ? input.bio : profile.bio,
      latitude: input.latitude !== undefined ? input.latitude : profile.latitude,
      longitude: input.longitude !== undefined ? input.longitude : profile.longitude,
      serviceRadiusKm: input.serviceRadiusKm !== undefined ? input.serviceRadiusKm : profile.serviceRadiusKm,
    },
  });

  return { success: true };
}

export async function addDocument(fileUrl: string, type: string) {
  const session = await auth();
  if (!session?.user) return { error: "unauthorized" };

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) return { error: "noProfile" };

  await prisma.document.create({
    data: {
      proId: profile.id,
      type,
      fileUrl,
    },
  });

  return { success: true };
}

export async function getProProfileFull() {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      documents: true,
      reviewsReceived: { select: { rating: true } },
    },
  });
}
