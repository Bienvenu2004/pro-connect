import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { JobCategory } from "@/generated/prisma/client";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

export async function notifyMatchingPros(
  jobId: string,
  category: JobCategory,
  latitude: number,
  longitude: number
) {
  const pros = await prisma.professionalProfile.findMany({
    where: {
      category,
      isAvailable: true,
      verificationStatus: "APPROVED",
      latitude: { not: null },
      longitude: { not: null },
    },
    include: { user: { select: { email: true, name: true } } },
  });

  const matchingPros = pros.filter((pro) => {
    if (!pro.latitude || !pro.longitude) return false;
    const distance = haversineDistance(latitude, longitude, pro.latitude, pro.longitude);
    return distance <= pro.serviceRadiusKm;
  });

  if (!resend || matchingPros.length === 0) {
    console.log(`[Notifications] ${matchingPros.length} pros matched for job ${jobId}`);
    return;
  }

  const job = await prisma.jobRequest.findUnique({
    where: { id: jobId },
    include: { client: { select: { name: true } } },
  });

  if (!job) return;

  for (const pro of matchingPros) {
    await resend.emails.send({
      from: "Mission Pro <notifications@missionpro.app>",
      to: pro.user.email,
      subject: `Nouvelle demande ${category} près de chez vous`,
      html: `
        <h2>Bonjour ${pro.user.name},</h2>
        <p>Un client a publié une nouvelle demande qui correspond à votre profil :</p>
        <ul>
          <li><strong>Catégorie :</strong> ${category}</li>
          <li><strong>Description :</strong> ${job.description.substring(0, 200)}</li>
          <li><strong>Adresse :</strong> ${job.address}</li>
          <li><strong>Urgence :</strong> ${job.urgency}</li>
        </ul>
        <p>Connectez-vous à votre tableau de bord pour répondre à cette demande.</p>
        <p>— L'équipe Mission Pro</p>
      `,
    }).catch(console.error);
  }
}
