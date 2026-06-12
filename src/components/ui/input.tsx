import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/* Inputs per inputs.md:
 * radius 12px, border 1px border-default-medium, bg neutral-secondary-medium
 * 14px heading, 0.25 letter, 12px h / 10px v pad
 * hover: border-default-strong
 * focus: border-brand + 2px brand ring, no outline
 * placeholder: body
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "block w-full rounded-[var(--radius-base)] border border-[var(--border-default-medium)] bg-[var(--neutral-secondary-medium)] px-3 py-2.5 text-sm text-[var(--heading)] tracking-[0.25px] transition-all outline-none placeholder:text-[var(--body)]",
        "hover:border-[var(--border-default-strong)]",
        "focus-visible:border-[var(--border-brand)] focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
        "disabled:bg-[var(--disabled)] disabled:text-[var(--fg-disabled)] disabled:cursor-not-allowed disabled:opacity-70",
        "aria-invalid:border-[var(--border-danger)] aria-invalid:ring-2 aria-invalid:ring-[var(--danger)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
