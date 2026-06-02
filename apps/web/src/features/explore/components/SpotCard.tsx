import { Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SpotListItem } from "@vivac/shared/types";

interface SpotCardProps {
  spot: SpotListItem;
}

export function SpotCard({ spot }: SpotCardProps) {
  const region = [spot.region_province, spot.region_city]
    .filter(Boolean)
    .join(" ");

  return (
    <Card size="sm" className="w-full">
      <CardHeader>
        <CardTitle>{spot.title}</CardTitle>
        {region && (
          <p className="text-xs text-muted-foreground">{region}</p>
        )}
      </CardHeader>
      {spot.tagline && (
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {spot.tagline}
          </p>
        </CardContent>
      )}
      <CardFooter className="gap-3">
        <span className="flex items-center gap-1 text-xs text-foreground">
          <Star className="size-3 fill-current" aria-hidden="true" />
          {spot.rating_avg.toFixed(1)}
          <span className="text-muted-foreground">({spot.review_count})</span>
        </span>
        {spot.themes && spot.themes.length > 0 && (
          <div className="flex gap-1 overflow-hidden">
            {spot.themes.slice(0, 3).map((theme) => (
              <span
                key={theme}
                className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {theme}
              </span>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
