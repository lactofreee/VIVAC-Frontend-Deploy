import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "홈 — VIVAC",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-semibold">오늘의 추천 장소</h1>
      {/* SpotRecommendation — P1-1-B 장소 탐색 UI 구현 시 추가 */}
    </div>
  );
}
