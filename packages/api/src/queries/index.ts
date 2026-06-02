import { useInfiniteQuery } from "@tanstack/react-query";

import { spotListResponseSchema } from "@vivac/shared/types";
import type { SpotFilter } from "@vivac/shared/types";

import { apiClient } from "../client";

export const spotKeys = {
  all: ["spots"] as const,
  list: (filter?: SpotFilter) => [...spotKeys.all, "list", filter ?? {}] as const,
} as const;

export function useInfiniteSpots(filter?: SpotFilter) {
  return useInfiniteQuery({
    queryKey: spotKeys.list(filter),
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = { limit: "20" };
      if (typeof pageParam === "string") params.cursor = pageParam;
      if (filter?.q) params.q = filter.q;
      if (filter?.sort) params.sort = filter.sort;

      const response = await apiClient.get<unknown>("/v1/explore/spots", { params });
      return spotListResponseSchema.parse(response.data);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
  });
}
