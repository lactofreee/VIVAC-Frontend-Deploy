import type { Metadata } from "next";

import { LogoutButton } from "@/features/auth/components/LogoutButton";

export const metadata: Metadata = {
  title: "프로필 — VIVAC",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-semibold">프로필</h1>
      {/* UserProfile — P1-3 소셜 로그인 구현 후 추가 */}
      <LogoutButton />
    </div>
  );
}
