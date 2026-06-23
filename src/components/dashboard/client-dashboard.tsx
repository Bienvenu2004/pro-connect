"use client";

import { useTranslations } from "next-intl";
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.title")}
        </h1>
        <p className="mt-1 text-gray-600">
          {t("dashboard.welcomeBack", { name: userName })}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("dashboard.myRequests")}
        </h2>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-gray-500">{t("dashboard.noJobs")}</p>
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
                    <JobStatusBadge status={job.status} />
                    <span className="text-xs text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {job.description}
                  </p>
                </div>
              </div>

              {job.contacts.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    {t("dashboard.contacts")}: {job.contacts.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.contacts.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs text-green-700"
                      >
                        {c.pro.user.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-t flex items-center justify-between">
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
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
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
