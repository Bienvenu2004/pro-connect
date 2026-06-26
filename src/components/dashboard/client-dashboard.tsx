"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { JobStatusBadge } from "./job-status-badge";
import { StatusActions } from "./status-actions";
import { ReviewForm } from "./review-form";

interface Contact {
  id: string;
  proId: string;
  message: string | null;
  pro: {
    id: string;
    user: { name: string; email: string };
  };
}

interface Job {
  id: string;
  category: string;
  description: string;
  urgency: string;
  status: string;
  createdAt: string;
  contacts: Contact[];
  review: { id: string; rating: number; comment: string | null } | null;
}

export function ClientDashboard({
  jobs,
  userName,
}: {
  jobs: Job[];
  userName: string;
}) {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {t("dashboard.title")}
          </h1>
          <p className="mt-1 text-gray-400">
            {t("dashboard.welcomeBack", { name: userName })}
          </p>
        </div>
        <Link
          href="/dashboard/create-job"
          className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("dashboard.createJob")}
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">
        {t("dashboard.myRequests")}
      </h2>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-500">{t("dashboard.noJobs")}</p>
          <Link
            href="/dashboard/create-job"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition"
          >
            {t("dashboard.createJob")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-medium text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                      {t(`categories.${job.category}`)}
                    </span>
                    <JobStatusBadge status={job.status} />
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${
                      job.urgency === "URGENT"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {job.urgency === "URGENT" ? t("jobs.urgentUrgent") : t("jobs.urgentPlanifie")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {job.description}
                  </p>
                </div>
              </div>

              {job.contacts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    {t("dashboard.contacts")}: {job.contacts.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.contacts.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400"
                      >
                        {c.pro.user.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex items-center justify-between flex-wrap gap-2">
                <StatusActions jobId={job.id} currentStatus={job.status} />

                {job.status === "COMPLETED" &&
                  !job.review &&
                  job.contacts.length > 0 && (
                    <ReviewForm
                      jobRequestId={job.id}
                      targetProId={job.contacts[0].pro.id}
                    />
                  )}

                {job.review && (
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    {"★".repeat(job.review.rating)}
                    {"☆".repeat(5 - job.review.rating)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
