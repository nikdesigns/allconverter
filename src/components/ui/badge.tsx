import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Badges per badges.md: 1px border, 8px radius (pill=9999), sizes, variants using tokens */
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand)] text-white border-transparent", /* treat as Brand */
        brand: "bg-[var(--brand-softer)] text-[var(--fg-brand-strong)] border-[var(--border-brand-subtle)]",
        secondary: "bg-[var(--neutral-primary-soft)] text-[var(--heading)] border-[var(--border-default)]",
        gray: "bg-[var(--neutral-secondary-medium)] text-[var(--heading)] border-[var(--border-default)]",
        success: "bg-[var(--success-soft)] text-[var(--fg-success-strong)] border-[var(--border-success-subtle)]",
        destructive: "bg-[var(--danger-soft)] text-[var(--fg-danger-strong)] border-[var(--border-danger-subtle)]",
        warning: "bg-[var(--warning-soft)] text-[var(--fg-warning)] border-[var(--border-warning-subtle)]",
        dark: "bg-[var(--dark)] text-white border-transparent",
        outline: "bg-transparent text-[var(--heading)] border-[var(--border-default)]",
        ghost: "bg-transparent text-[var(--body)] border-transparent hover:bg-[var(--neutral-secondary-soft)]",
      },
      size: {
        default: "h-5 text-[12px] px-2 py-px rounded-[8px]", /* small */
        lg: "h-6 text-[14px] px-2.5 py-1 rounded-[8px]",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
