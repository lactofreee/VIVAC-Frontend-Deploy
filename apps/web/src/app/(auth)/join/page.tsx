import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 — VIVAC",
};

export default function JoinPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="text-sm text-muted-foreground">VIVAC과 함께 시작하세요</p>
      </div>
      {/* JoinForm — P1-3 소셜 로그인 구현 시 추가 */}
    </div>
  );
}
