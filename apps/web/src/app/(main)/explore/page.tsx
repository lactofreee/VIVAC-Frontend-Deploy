import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "탐색 — VIVAC",
};

export default function ExplorePage() {
  return (
    <div className="relative flex h-[calc(100dvh-4rem)] flex-col">
      {/* 지도 영역 — full-bleed, 바텀 시트 뒤에 위치 */}
      <div
        className="absolute inset-0 bg-muted"
        aria-label="지도 영역"
        role="region"
      >
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">지도 준비 중</p>
        </div>
      </div>

      {/* 필터 바 — 지도 위에 float */}
      <div className="relative z-10 flex gap-2 overflow-x-auto p-3 scrollbar-none">
        {/* FilterChip — P1-1-B 탐색 UI 구현 시 추가 */}
        <div className="h-8 w-20 shrink-0 rounded-full bg-background/90 shadow-sm backdrop-blur-sm" />
        <div className="h-8 w-24 shrink-0 rounded-full bg-background/90 shadow-sm backdrop-blur-sm" />
        <div className="h-8 w-16 shrink-0 rounded-full bg-background/90 shadow-sm backdrop-blur-sm" />
      </div>

      {/* 바텀 시트 — 장소 목록 패널 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col rounded-t-2xl bg-background shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm font-semibold text-foreground">주변 장소</span>
        </div>
        <div className="overflow-y-auto px-4 pb-4" style={{ maxHeight: "40dvh" }}>
          {/* SpotList — P1-1-B 구현 시 추가 */}
          <p className="py-8 text-center text-sm text-muted-foreground">
            장소를 불러오는 중...
          </p>
        </div>
      </div>
    </div>
  );
}
