import Link from "next/link";

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
      <Link
        href="/author/nitin/"
        className="h-9 w-9 rounded-full bg-linear-to-br from-primary/80 to-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0 hover:opacity-90 transition-opacity"
      >
        NK
      </Link>
      <div className="flex flex-col gap-0.5">
        <Link
          href="/author/nitin/"
          className="font-medium text-foreground text-xs hover:underline"
        >
          Nitin Kaushik
        </Link>
        <span className="text-xs">
          Published {formatDate(publishedAt)}
          {updatedAt && updatedAt !== publishedAt && ` · Updated ${formatDate(updatedAt)}`}
          {" · "}{readingTime} min read
        </span>
      </div>
    </div>
  );
}
