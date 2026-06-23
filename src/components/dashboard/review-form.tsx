"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitReview } from "@/lib/actions/reviews";

export function ReviewForm({
  jobRequestId,
  targetProId,
}: {
  jobRequestId: string;
  targetProId: string;
}) {
  const t = useTranslations("review");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    const result = await submitReview({
      jobRequestId,
      targetProId,
      rating,
      comment: comment.trim() || undefined,
    });

    if (result.success) {
      setDone(true);
      router.refresh();
    }
    setLoading(false);
  }

  if (done) {
    return (
      <span className="text-xs text-green-600 font-medium">
        {t("success")}
      </span>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs rounded bg-orange-100 text-orange-700 px-3 py-1 hover:bg-orange-200 transition"
      >
        {t("title")}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-lg ${star <= rating ? "text-yellow-500" : "text-gray-300"} hover:text-yellow-400 transition`}
          >
            ★
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder={t("comment")}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="rounded border px-2 py-1 text-xs w-32"
      />
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="text-xs rounded bg-orange-600 text-white px-3 py-1 hover:bg-orange-700 transition disabled:opacity-50"
      >
        {t("submit")}
      </button>
    </form>
  );
}
