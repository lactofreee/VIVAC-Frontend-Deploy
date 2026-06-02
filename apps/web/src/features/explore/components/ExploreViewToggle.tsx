"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ExploreView = "list" | "map";

interface ExploreViewToggleProps {
  view: ExploreView;
  onViewChange: (view: ExploreView) => void;
}

export function ExploreViewToggle({ view, onViewChange }: ExploreViewToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="보기 방식 선택"
      className="flex rounded-xl border border-border bg-muted p-1"
    >
      <Button
        role="tab"
        aria-selected={view === "list"}
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        className={cn("flex-1", view === "list" && "shadow-sm")}
        onClick={() => onViewChange("list")}
      >
        목록 보기
      </Button>
      <Button
        role="tab"
        aria-selected={view === "map"}
        variant={view === "map" ? "default" : "ghost"}
        size="sm"
        className={cn("flex-1", view === "map" && "shadow-sm")}
        onClick={() => onViewChange("map")}
      >
        지도로 보기
      </Button>
    </div>
  );
}
