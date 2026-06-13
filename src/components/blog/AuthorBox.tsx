interface Props {
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AuthorBox({ publishedAt, updatedAt, readingTime }: Props) {
  return (
    <div className="flex items-center gap-3 py-3 border-y border-border text-sm text-muted-foreground">
      <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
        AC
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-foreground text-xs">AllConverter.tools Team</span>
        <span className="text-xs">
          Published {formatDate(publishedAt)}
          {updatedAt && updatedAt !== publishedAt && ` · Updated ${formatDate(updatedAt)}`}
          {" · "}{readingTime} min read
        </span>
      </div>
    </div>
  );
}
