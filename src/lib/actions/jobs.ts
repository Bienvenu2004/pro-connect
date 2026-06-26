"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JobStatus, JobCategory, UrgencyLevel } from "@/generated/prisma/client";
import { notifyMatchingPros } from "@/lib/notifications";

export async function getClientJobs() {
  const session = await auth();
  if (!session?.user) return [];

  return prisma.jobRequest.findMany({
    where: { clientId: session.user.id },
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
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  const session = await auth();
  if (!session?.user) return { error: "unauthorized" };

  const job = await prisma.jobRequest.findUnique({ where: { id: jobId } });
  if (!job) return { error: "notFound" };

  if (job.clientId !== session.user.id) {
    return { error: "unauthorized" };
  }

  await prisma.jobRequest.update({
    where: { id: jobId },
    data: { status },
  });

  return { success: true };
}

interface CreateJobInput {
  category: string;
  description: string;
  urgency: string;
  photos: string[];
  address: string;
  latitude: number;
  longitude: number;
}

export async function createJobRequest(input: CreateJobInput) {
  const session = await auth();
  if (!session?.user) return { error: "unauthorized" };

  const { category, description, urgency, photos, address, latitude, longitude } = input;

  const job = await prisma.jobRequest.create({
    data: {
      clientId: session.user.id,
      category: category as JobCategory,
      description,
      urgency: urgency as UrgencyLevel,
      photos,
      address,
      latitude,
      longitude,
    },
  });

  notifyMatchingPros(job.id, category as JobCategory, latitude, longitude).catch(console.error);

  return { success: true, jobId: job.id };
}

export async function contactClient(jobRequestId: string, message?: string) {
  const session = await auth();
  if (!session?.user) return { error: "unauthorized" };

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) return { error: "noProfile" };
  if (profile.verificationStatus !== "APPROVED") return { error: "notApproved" };

  const existing = await prisma.jobRequestContact.findUnique({
    where: { jobRequestId_proId: { jobRequestId, proId: profile.id } },
  });

  if (existing) return { error: "alreadyContacted" };

  await prisma.jobRequestContact.create({
    data: {
      jobRequestId,
      proId: profile.id,
      message: message || null,
    },
  });

  return { success: true };
}
