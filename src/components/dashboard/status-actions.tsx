"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateJobStatus } from "@/lib/actions/jobs";

export function StatusActions({
  jobId,
  currentStatus,
}: {
  jobId: string;
  currentStatus: string;
}) {
  const t = useTranslations("jobs");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(newStatus: "IN_PROGRESS" | "COMPLETED" | "CANCELLED") {
    setLoading(true);
    await updateJobStatus(jobId, newStatus);
    router.refresh();
    setLoading(false);
  }

  if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") {
    return null;
  }

  return (
    <div className="flex gap-2">
      {currentStatus === "OPEN" && (
        <button
          onClick={() => handleStatusChange("IN_PROGRESS")}
          disabled={loading}
          className="text-xs rounded bg-yellow-100 text-yellow-700 px-3 py-1 hover:bg-yellow-200 transition disabled:opacity-50"
        >
          {t("markInProgress")}
        </button>
      )}
      {(currentStatus === "OPEN" || currentStatus === "IN_PROGRESS") && (
        <button
          onClick={() => handleStatusChange("COMPLETED")}
          disabled={loading}
          className="text-xs rounded bg-green-100 text-green-700 px-3 py-1 hover:bg-green-200 transition disabled:opacity-50"
        >
          {t("markCompleted")}
        </button>
      )}
      {currentStatus === "OPEN" && (
        <button
          onClick={() => handleStatusChange("CANCELLED")}
          disabled={loading}
          className="text-xs rounded bg-red-100 text-red-700 px-3 py-1 hover:bg-red-200 transition disabled:opacity-50"
        >
          {t("markCancelled")}
        </button>
      )}
    </div>
  );
}
