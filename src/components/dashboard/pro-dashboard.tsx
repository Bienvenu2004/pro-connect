"use client";

import { useTranslations } from "next-intl";
import { AvailabilityToggle } from "./availability-toggle";
import { JobStatusBadge } from "./job-status-badge";

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t("pro.dashboard")}
        </h1>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <p className="text-yellow-800">{t("pro.pendingVerification")}</p>
        </div>
      </div>
    );
  }

  if (profile.verificationStatus === "REJECTED") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t("pro.dashboard")}
        </h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-800">{t("pro.rejected")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("pro.dashboard")}
          </h1>
          <p className="mt-1 text-gray-600">
            {t("dashboard.welcomeBack", { name: userName })}
          </p>
        </div>
        <AvailabilityToggle isAvailable={profile.isAvailable} />
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t("pro.openRequests")}
      </h2>

      {!profile.isAvailable ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-gray-500">{t("pro.unavailable")}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-gray-500">{t("pro.noRequests")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {t(`categories.${job.category}`)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        job.urgency === "URGENT"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {job.urgency === "URGENT"
                        ? t("jobs.urgentUrgent")
                        : t("jobs.urgentPlanifie")}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {job.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {job.client.name} — {job.address}
                  </p>
                </div>
                <div className="ml-4">
                  {job.contacts.length > 0 ? (
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                      {t("pro.alreadyContacted")}
                    </span>
                  ) : (
                    <ContactButton jobId={job.id} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactButton({ jobId }: { jobId: string }) {
  const t = useTranslations("pro");

  return (
    <button
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
      onClick={() => {
        // Will be implemented with the contact system
      }}
    >
      {t("contact")}
    </button>
  );
}
