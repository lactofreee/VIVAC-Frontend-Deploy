import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "취향 설정 — VIVAC",
};

export default function SurveyPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">어떤 캠핑을 즐기시나요?</h1>
      {/* SurveyFlow — 온보딩 구현 시 추가 */}
    </div>
  );
}
