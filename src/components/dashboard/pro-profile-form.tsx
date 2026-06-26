"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useRef } from "react";
import { updateProProfile, addDocument } from "@/lib/actions/profile";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/map-picker"), { ssr: false });

interface Profile {
  id: string;
  bio: string | null;
  category: string;
  latitude: number | null;
  longitude: number | null;
  serviceRadiusKm: number;
  verificationStatus: string;
  user: { name: string; email: string; phone: string | null };
  documents: { id: string; type: string; fileUrl: string }[];
  reviewsReceived: { rating: number }[];
}

const DOC_TYPES = ["id_card", "diploma", "certification", "business_registry"];

export function ProProfileForm({ profile }: { profile: Profile }) {
  const t = useTranslations();
  const router = useRouter();
  const [bio, setBio] = useState(profile.bio || "");
  const [radius, setRadius] = useState(profile.serviceRadiusKm);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    profile.latitude && profile.longitude
      ? { lat: profile.latitude, lng: profile.longitude }
      : null
  );
  const [address, setAddress] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const fileRef = useRef<HTMLInputElement>(null);

  const avgRating =
    profile.reviewsReceived.length > 0
      ? (profile.reviewsReceived.reduce((a, r) => a + r.rating, 0) / profile.reviewsReceived.length).toFixed(1)
      : null;

  async function handleGeocode() {
    if (!address.trim()) return;
    setGeocoding(true);
    const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
    const data = await res.json();
    if (data.latitude && data.longitude) {
      setCoords({ lat: data.latitude, lng: data.longitude });
    }
    setGeocoding(false);
  }

  async function handleSave() {
    setSaving(true);
    await updateProProfile({
      bio,
      latitude: coords?.lat,
      longitude: coords?.lng,
      serviceRadiusKm: radius,
    });
    setSaving(false);
    router.refresh();
  }

  async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.url) {
      await addDocument(data.url, docType);
      router.refresh();
    }
    setUploadingDoc(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t("nav.profile")}</h1>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-sm text-gray-400">{profile.user.email}</span>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400">
            {t(`categories.${profile.category}`)}
          </span>
          {avgRating && (
            <span className="text-xs text-yellow-400">★ {avgRating} ({profile.reviewsReceived.length})</span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Bio */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="block w-full rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition resize-none"
            placeholder="Décrivez votre expérience..."
          />
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <label className="block text-sm font-medium text-gray-300 mb-2">Zone de couverture</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Votre adresse..."
              className="flex-1 rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 outline-none transition"
            />
            <button
              onClick={handleGeocode}
              disabled={geocoding}
              className="rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-3 text-sm text-gray-300 hover:border-orange-500 transition disabled:opacity-50"
            >
              {geocoding ? "..." : "Localiser"}
            </button>
          </div>

          {coords && (
            <div className="rounded-xl overflow-hidden border border-[#3a3a3a] mb-3" style={{ height: "200px" }}>
              <MapPicker
                latitude={coords.lat}
                longitude={coords.lng}
                onPositionChange={(lat, lng) => setCoords({ lat, lng })}
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Rayon de service: {radius} km
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t("admin.documents")}</label>

          {profile.documents.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 py-1.5 text-blue-400 hover:text-blue-300"
                >
                  {doc.type}
                </a>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-center">
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
            >
              {DOC_TYPES.map((type) => (
                <option key={type} value={type}>{type.replace("_", " ")}</option>
              ))}
            </select>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingDoc}
              className="rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-2 text-sm text-gray-300 hover:border-orange-500 transition disabled:opacity-50"
            >
              {uploadingDoc ? "..." : "Upload"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleDocUpload}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 disabled:opacity-50 transition"
        >
          {saving ? t("common.loading") : t("common.save")}
        </button>
      </div>
    </div>
  );
}
