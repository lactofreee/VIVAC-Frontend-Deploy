import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIVAC — 백패킹 캠핑지 탐색",
  description: "어디서 자도 되는가. 신뢰할 수 있는 백패킹 장소 정보를 제공합니다.",
};

export default function MarketingPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 px-4 py-20 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          어디서 자도 되는가
        </h1>
        <p className="text-lg text-muted-foreground">
          국내 백패킹·미니멀 캠핑 유저를 위한 통합 장소 탐색
        </p>
      </div>
      {/* CTA — P1-4 랜딩페이지 구현 시 추가 */}
    </section>
  );
}
