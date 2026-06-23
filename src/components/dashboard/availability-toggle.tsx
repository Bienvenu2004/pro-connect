"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleAvailability } from "@/lib/actions/pro";

export function AvailabilityToggle({
  isAvailable: initialValue,
}: {
  isAvailable: boolean;
}) {
  const t = useTranslations("pro");
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const result = await toggleAvailability();
    if (result.success) {
      setIsAvailable(result.isAvailable!);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
        isAvailable
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-400"}`}
      />
      {isAvailable ? t("available") : t("unavailable")}
    </button>
  );
}
