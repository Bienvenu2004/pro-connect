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
    <div className="flex gap-2 flex-wrap">
      {currentStatus === "OPEN" && (
        <button
          onClick={() => handleStatusChange("IN_PROGRESS")}
          disabled={loading}
          className="text-xs rounded-lg bg-yellow-500/10 text-yellow-400 px-3 py-1.5 hover:bg-yellow-500/20 transition disabled:opacity-50"
        >
          {t("markInProgress")}
        </button>
      )}
      {(currentStatus === "OPEN" || currentStatus === "IN_PROGRESS") && (
        <button
          onClick={() => handleStatusChange("COMPLETED")}
          disabled={loading}
          className="text-xs rounded-lg bg-green-500/10 text-green-400 px-3 py-1.5 hover:bg-green-500/20 transition disabled:opacity-50"
        >
          {t("markCompleted")}
        </button>
      )}
      {currentStatus === "OPEN" && (
        <button
          onClick={() => handleStatusChange("CANCELLED")}
          disabled={loading}
          className="text-xs rounded-lg bg-red-500/10 text-red-400 px-3 py-1.5 hover:bg-red-500/20 transition disabled:opacity-50"
        >
          {t("markCancelled")}
        </button>
      )}
    </div>
  );
}
