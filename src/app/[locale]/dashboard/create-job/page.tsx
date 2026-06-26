"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useRef } from "react";
import { createJobRequest } from "@/lib/actions/jobs";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/map-picker"), { ssr: false });

const CATEGORIES = [
  "PLOMBERIE",
  "ELECTRICITE",
  "MACONNERIE",
  "MECANIQUE",
  "INGENIERIE",
  "AUTRE",
] as const;

export default function CreateJobPage() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    if (photos.length + files.length > 5) {
      setError("Maximum 5 photos");
      return;
    }

    setUploading(true);
    const newPhotos: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url) {
        newPhotos.push(data.url);
      }
    }

    setPhotos([...photos, ...newPhotos]);
    setUploading(false);
  }

  async function handleGeocode() {
    if (!address.trim()) return;
    setGeocoding(true);

    const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
    const data = await res.json();

    if (data.latitude && data.longitude) {
      setCoords({ lat: data.latitude, lng: data.longitude });
      setError("");
    } else {
      setError(t("jobs.errorAddress"));
    }
    setGeocoding(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!coords) {
      setError(t("jobs.errorAddress"));
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await createJobRequest({
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      urgency: formData.get("urgency") as string,
      photos,
      address,
      latitude: coords.lat,
      longitude: coords.lng,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-green-400">{t("jobs.success")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t("jobs.createTitle")}</h1>
        <p className="mt-1 text-gray-400">{t("jobs.createSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("jobs.categoryLabel")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="relative">
                <input type="radio" name="category" value={cat} defaultChecked={cat === "PLOMBERIE"} className="peer sr-only" />
                <div className="rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] p-3 text-center cursor-pointer peer-checked:border-orange-500 peer-checked:bg-orange-500/10 hover:border-gray-500 transition">
                  <span className="text-sm font-medium text-gray-300 peer-checked:text-orange-400">
                    {t(`categories.${cat}`)}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            {t("jobs.descriptionLabel")}
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder={t("jobs.descriptionPlaceholder")}
            className="block w-full rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition resize-none"
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("jobs.urgencyLabel")}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative">
              <input type="radio" name="urgency" value="URGENT" defaultChecked className="peer sr-only" />
              <div className="rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] p-3 text-center cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-500/10 hover:border-gray-500 transition">
                <span className="text-sm font-medium text-gray-300">{t("jobs.urgentUrgent")}</span>
              </div>
            </label>
            <label className="relative">
              <input type="radio" name="urgency" value="PLANIFIE" className="peer sr-only" />
              <div className="rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] p-3 text-center cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-500/10 hover:border-gray-500 transition">
                <span className="text-sm font-medium text-gray-300">{t("jobs.urgentPlanifie")}</span>
              </div>
            </label>
          </div>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("jobs.photosLabel")}
          </label>
          <p className="text-xs text-gray-500 mb-3">{t("jobs.photosHint")}</p>
          <div className="flex flex-wrap gap-3">
            {photos.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#3a3a3a]">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white text-xs"
                >
                  ×
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-[#3a3a3a] flex items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 transition"
              >
                {uploading ? "..." : "+"}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        {/* Address + Map */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("jobs.addressLabel")}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("jobs.addressPlaceholder")}
              className="flex-1 rounded-xl border border-[#3a3a3a] bg-[#1a1a1a] px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
            />
            <button
              type="button"
              onClick={handleGeocode}
              disabled={geocoding}
              className="rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:border-orange-500 transition disabled:opacity-50"
            >
              {geocoding ? "..." : t("jobs.geocodeButton")}
            </button>
          </div>
          {coords && (
            <div className="mt-3 rounded-xl overflow-hidden border border-[#3a3a3a]" style={{ height: "250px" }}>
              <MapPicker
                latitude={coords.lat}
                longitude={coords.lng}
                onPositionChange={(lat, lng) => setCoords({ lat, lng })}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !coords}
          className="w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 disabled:opacity-50 transition"
        >
          {loading ? t("common.loading") : t("jobs.submitJob")}
        </button>
      </form>
    </div>
  );
}
