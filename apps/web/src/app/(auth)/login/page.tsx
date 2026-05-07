import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 — VIVAC",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="text-sm text-muted-foreground">VIVAC 계정으로 로그인하세요</p>
      </div>
      {/* LoginForm — P1-3 소셜 로그인 구현 시 추가 */}
    </div>
  );
}
