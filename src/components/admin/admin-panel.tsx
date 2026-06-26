"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateVerificationStatus, toggleUserActive } from "@/lib/actions/admin";

interface PendingPro {
  id: string;
  category: string;
  user: { name: string; email: string; createdAt: string };
  documents: { id: string; type: string; fileUrl: string }[];
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export function AdminPanel({
  pendingPros,
  users,
}: {
  pendingPros: PendingPro[];
  users: UserItem[];
}) {
  const t = useTranslations();
  const [tab, setTab] = useState<"pending" | "users">("pending");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">{t("admin.title")}</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("pending")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "pending"
              ? "bg-orange-500 text-white"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]"
          }`}
        >
          {t("admin.pendingPros")} ({pendingPros.length})
        </button>
        <button
          onClick={() => setTab("users")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "users"
              ? "bg-orange-500 text-white"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]"
          }`}
        >
          {t("admin.allUsers")} ({users.length})
        </button>
      </div>

      {tab === "pending" && <PendingProsList pros={pendingPros} />}
      {tab === "users" && <UsersList users={users} />}
    </div>
  );
}

function PendingProsList({ pros }: { pros: PendingPro[] }) {
  const t = useTranslations();
  const router = useRouter();

  async function handleVerification(profileId: string, status: "APPROVED" | "REJECTED") {
    await updateVerificationStatus(profileId, status);
    router.refresh();
  }

  if (pros.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 text-center">
        <p className="text-gray-500">{t("admin.noPending")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pros.map((pro) => (
        <div key={pro.id} className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-white">{pro.user.name}</p>
              <p className="text-sm text-gray-400">{pro.user.email}</p>
              <p className="text-xs text-orange-400 mt-1">
                {t(`categories.${pro.category}`)}
              </p>
              {pro.documents.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">{t("admin.documents")}:</p>
                  <div className="flex gap-2 flex-wrap">
                    {pro.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-2 py-1 text-blue-400 hover:text-blue-300"
                      >
                        {doc.type}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleVerification(pro.id, "APPROVED")}
                className="rounded-lg bg-green-500/10 text-green-400 px-4 py-2 text-sm font-medium hover:bg-green-500/20 transition"
              >
                {t("admin.approve")}
              </button>
              <button
                onClick={() => handleVerification(pro.id, "REJECTED")}
                className="rounded-lg bg-red-500/10 text-red-400 px-4 py-2 text-sm font-medium hover:bg-red-500/20 transition"
              >
                {t("admin.reject")}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersList({ users }: { users: UserItem[] }) {
  const t = useTranslations();
  const router = useRouter();

  async function handleToggle(userId: string) {
    await toggleUserActive(userId);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">{t("common.name")}</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">{t("common.email")}</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Role</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">{t("dashboard.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#2a2a2a] last:border-0">
                <td className="px-4 py-3 text-white">{user.name}</td>
                <td className="px-4 py-3 text-gray-400">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${
                    user.role === "ADMIN"
                      ? "bg-purple-500/10 text-purple-400"
                      : user.role === "PROFESSIONAL"
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${
                    user.isActive
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {user.isActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => handleToggle(user.id)}
                      className={`text-xs rounded-lg px-3 py-1.5 font-medium transition ${
                        user.isActive
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      }`}
                    >
                      {user.isActive ? t("admin.block") : t("admin.unblock")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
