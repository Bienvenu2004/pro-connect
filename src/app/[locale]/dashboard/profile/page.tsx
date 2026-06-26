import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProProfileFull } from "@/lib/actions/profile";
import { ProProfileForm } from "@/components/dashboard/pro-profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "PROFESSIONAL") redirect("/dashboard");

  const profile = await getProProfileFull();
  if (!profile) redirect("/dashboard");

  return (
    <ProProfileForm profile={JSON.parse(JSON.stringify(profile))} />
  );
}
