"use client";

import { useEffect, useRef } from "react";

import { useInfiniteSpots } from "@vivac/api/queries";
import type { SpotFilter } from "@vivac/shared/types";

import { SpotCard } from "./SpotCard";

function SpotCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-4 w-12 rounded-full bg-muted" />
      </div>
      <div className="mb-3 h-3 w-1/3 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted" />
      <div className="mt-1 h-3 w-4/5 rounded bg-muted" />
    </div>
  );
}

interface SpotListProps {
  filter?: SpotFilter;
}

export function SpotList({ filter }: SpotListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteSpots(filter);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SpotCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm font-medium text-foreground">불러오기 실패</p>
        <p className="text-xs text-muted-foreground">
          잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  const spots = data?.pages.flatMap((page) => page.items) ?? [];

  if (spots.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        장소가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {spots.map((spot) => (
        <SpotCard key={spot.uid} spot={spot} />
      ))}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      {isFetchingNextPage && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SpotCardSkeleton key={`next-${i}`} />
          ))}
        </div>
      )}
      {!hasNextPage && (
        <p className="py-4 text-center text-xs text-muted-foreground">
          모든 장소를 불러왔습니다.
        </p>
      )}
    </div>
  );
}
