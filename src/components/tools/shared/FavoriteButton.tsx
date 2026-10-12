"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { isFavorite, onFavoritesChange, toggleFavorite } from "@/lib/favorites";

/** Star toggle that pins a tool to the visitor's favourites (saved in this browser only). */
export function FavoriteButton({ slug, name }: { slug: string; name: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(isFavorite(slug));
    sync();
    return onFavoritesChange(sync);
  }, [slug]);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
      title={active ? "Remove from favourites" : "Add to favourites"}
      onClick={() => {
        const now = toggleFavorite(slug);
        toast.success(now ? "Added to favourites — find it on the home page" : "Removed from favourites");
      }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
        active
          ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      <Star className={cn("w-4 h-4", active && "fill-current")} />
    </button>
  );
}
