"use client";

import { useTranslations } from "next-intl";

const statusStyles: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export function JobStatusBadge({ status }: { status: string }) {
  const t = useTranslations("jobs");

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded ${statusStyles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {t(`status${status}`)}
    </span>
  );
}
