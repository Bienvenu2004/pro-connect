"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { AvailabilityToggle } from "./availability-toggle";
import { JobStatusBadge } from "./job-status-badge";
import { contactClient } from "@/lib/actions/jobs";

interface ProProfile {
  id: string;
  isAvailable: boolean;
  verificationStatus: string;
  category: string;
}

interface ProJob {
  id: string;
  category: string;
  description: string;
  urgency: string;
  address: string;
  createdAt: string;
  client: { name: string };
  contacts: { id: string }[];
}

export function ProDashboard({
  profile,
  jobs,
  userName,
}: {
  profile: ProProfile | null;
  jobs: ProJob[];
  userName: string;
}) {
  const t = useTranslations();

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-500">Aucun profil professionnel trouvé.</p>
      </div>
    );
  }

  if (profile.verificationStatus === "PENDING") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-4">
          {t("pro.dashboard")}
        </h1>
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-yellow-300">{t("pro.pendingVerification")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (profile.verificationStatus === "REJECTED") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-4">
          {t("pro.dashboard")}
        </h1>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-300">{t("pro.rejected")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {t("pro.dashboard")}
          </h1>
          <p className="mt-1 text-gray-400">
            {t("dashboard.welcomeBack", { name: userName })}
          </p>
        </div>
        <AvailabilityToggle isAvailable={profile.isAvailable} />
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">
        {t("pro.openRequests")}
      </h2>

      {!profile.isAvailable ? (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-12 text-center">
          <p className="text-gray-500">{t("pro.unavailable")}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500">{t("pro.noRequests")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job }: { job: ProJob & { contacts: { id: string }[] } }) {
  const t = useTranslations();
  const router = useRouter();
  const [contacting, setContacting] = useState(false);
  const [contacted, setContacted] = useState(job.contacts.length > 0);

  async function handleContact() {
    setContacting(true);
    const result = await contactClient(job.id);
    if (result.success) {
      setContacted(true);
    }
    setContacting(false);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-xs font-medium text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg">
              {t(`categories.${job.category}`)}
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                job.urgency === "URGENT"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-blue-500/10 text-blue-400"
              }`}
            >
              {job.urgency === "URGENT" ? t("jobs.urgentUrgent") : t("jobs.urgentPlanifie")}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-300 text-sm line-clamp-2">
            {job.description}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {job.client.name} — {job.address}
          </p>
        </div>
        <div className="ml-4">
          {contacted ? (
            <span className="text-xs text-green-400 font-medium bg-green-500/10 px-3 py-1.5 rounded-full">
              {t("pro.alreadyContacted")}
            </span>
          ) : (
            <button
              onClick={handleContact}
              disabled={contacting}
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition"
            >
              {contacting ? "..." : t("pro.contact")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
