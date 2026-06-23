"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ReviewInput {
  jobRequestId: string;
  targetProId: string;
  rating: number;
  comment?: string;
}

export async function submitReview(input: ReviewInput) {
  const session = await auth();
  if (!session?.user) return { error: "unauthorized" };

  const { jobRequestId, targetProId, rating, comment } = input;

  const job = await prisma.jobRequest.findUnique({
    where: { id: jobRequestId },
  });

  if (!job || job.clientId !== session.user.id) {
    return { error: "unauthorized" };
  }

  if (job.status !== "COMPLETED") {
    return { error: "jobNotCompleted" };
  }

  const existing = await prisma.review.findUnique({
    where: { jobRequestId },
  });

  if (existing) {
    return { error: "alreadyReviewed" };
  }

  await prisma.review.create({
    data: {
      jobRequestId,
      authorId: session.user.id,
      targetProId,
      rating: Math.min(5, Math.max(1, rating)),
      comment: comment || null,
    },
  });

  return { success: true };
}
