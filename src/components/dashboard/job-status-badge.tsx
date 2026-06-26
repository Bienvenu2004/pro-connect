"use client";

import { useTranslations } from "next-intl";

const statusStyles: Record<string, string> = {
  OPEN: "bg-blue-500/10 text-blue-400",
  IN_PROGRESS: "bg-yellow-500/10 text-yellow-400",
  COMPLETED: "bg-green-500/10 text-green-400",
  CANCELLED: "bg-gray-500/10 text-gray-400",
};

export function JobStatusBadge({ status }: { status: string }) {
  const t = useTranslations("jobs");

  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusStyles[status] || "bg-gray-500/10 text-gray-400"}`}
    >
      {t(`status${status}`)}
    </span>
  );
}
