export function MapPlaceholder() {
  return (
    <div
      className="flex flex-1 items-center justify-center bg-muted"
      aria-label="지도 영역 (준비 중)"
      role="region"
    >
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">지도 준비 중</p>
        <p className="mt-1 text-xs text-muted-foreground">
          지도 연동은 다음 스프린트에서 구현됩니다.
        </p>
      </div>
    </div>
  );
}
