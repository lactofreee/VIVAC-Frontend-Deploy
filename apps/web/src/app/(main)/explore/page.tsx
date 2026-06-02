"use client";

import { useState } from "react";

import { ExploreViewToggle } from "@/features/explore/components/ExploreViewToggle";
import { MapPlaceholder } from "@/features/explore/components/MapPlaceholder";
import { SpotList } from "@/features/explore/components/SpotList";
import type { ExploreView } from "@/features/explore/components/ExploreViewToggle";

export default function ExplorePage() {
  const [view, setView] = useState<ExploreView>("list");

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="shrink-0 px-4 pt-4 pb-2">
        <ExploreViewToggle view={view} onViewChange={setView} />
      </div>
      {view === "list" ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SpotList />
        </div>
      ) : (
        <MapPlaceholder />
      )}
    </div>
  );
}
