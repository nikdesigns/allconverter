import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-[var(--radius-base)] border border-[var(--border-default-medium)] bg-[var(--neutral-secondary-medium)] px-3 py-2.5 text-sm text-[var(--heading)] tracking-[0.25px] transition-all outline-none placeholder:text-[var(--body)] hover:border-[var(--border-default-strong)] focus-visible:border-[var(--border-brand)] focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:bg-[var(--disabled)] disabled:text-[var(--fg-disabled)] disabled:cursor-not-allowed aria-invalid:border-[var(--border-danger)] aria-invalid:ring-2 aria-invalid:ring-[var(--danger)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
