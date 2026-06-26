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
          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
          : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-500"}`}
      />
      {isAvailable ? t("available") : t("unavailable")}
    </button>
  );
}
