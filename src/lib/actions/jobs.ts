"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JobStatus } from "@/generated/prisma/client";

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
