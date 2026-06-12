import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Buttons per buttons.md: 9999px pill, 1px border, 500 weight, 0.1px letter, 200ms, 18px icon + 8px gap */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px] gap-2",
  {
    variants: {
      variant: {
        /* Brand (primary) */
        default: "bg-[var(--brand)] text-white border-transparent hover:bg-[var(--brand-strong)] focus-visible:ring-4 focus-visible:ring-[var(--brand-medium)]",
        /* Secondary */
        secondary: "bg-[var(--neutral-secondary-medium)] text-[var(--body)] border-[var(--border-default-medium)] hover:bg-[var(--neutral-tertiary-medium)] hover:text-[var(--heading)] focus-visible:ring-4 focus-visible:ring-[var(--neutral-tertiary)]",
        /* Tertiary */
        tertiary: "bg-[var(--neutral-primary-soft)] text-[var(--body)] border-[var(--border-default)] hover:bg-[var(--neutral-secondary-medium)] hover:text-[var(--heading)] focus-visible:ring-4 focus-visible:ring-[var(--neutral-tertiary-soft)]",
        /* Success */
        success: "bg-[var(--success)] text-white border-transparent hover:bg-[var(--success-strong)] focus-visible:ring-4 focus-visible:ring-[var(--success-medium)]",
        /* Danger */
        destructive: "bg-[var(--danger)] text-white border-transparent hover:bg-[var(--danger-strong)] focus-visible:ring-4 focus-visible:ring-[var(--danger-medium)]",
        /* Warning */
        warning: "bg-[var(--warning)] text-white border-transparent hover:bg-[var(--warning-strong)] focus-visible:ring-4 focus-visible:ring-[var(--warning-medium)]",
        /* Dark */
        dark: "bg-[var(--dark)] text-white border-transparent hover:bg-[var(--dark-strong)] focus-visible:ring-4 focus-visible:ring-[var(--neutral-tertiary)]",
        /* Ghost */
        ghost: "bg-transparent text-[var(--heading)] border-transparent hover:bg-[var(--neutral-secondary-medium)] focus-visible:ring-4 focus-visible:ring-[var(--neutral-tertiary)] shadow-none",
        /* Link style (CTA) */
        link: "bg-transparent text-[var(--fg-brand)] border-transparent underline hover:no-underline px-0 h-auto py-0 focus-visible:ring-0",
        outline: "border-[var(--border-default)] bg-transparent text-[var(--body)] hover:bg-[var(--neutral-secondary-medium)] hover:text-[var(--heading)] focus-visible:ring-4 focus-visible:ring-[var(--neutral-tertiary-soft)]",
      },
      size: {
        /* xs: 12px / 16px h / 6px v */
        xs: "h-6 text-xs px-4 py-[6px] gap-1.5 [&_svg:not([class*='size-'])]:size-[14px]",
        /* sm: 14px / 16px h / 8px v */
        sm: "h-7 text-sm px-4 py-2 gap-1.5",
        /* base (default): 14px / 24px h / 10px v */
        default: "h-10 text-sm px-6 py-2.5",
        /* lg: 16px / 24px h / 12px v */
        lg: "h-11 text-base px-6 py-3",
        /* xl: 16px / 32px h / 14px v */
        xl: "h-12 text-base px-8 py-[14px]",
        /* icon sizes */
        icon: "size-10 p-0",
        "icon-xs": "size-6 p-0 [&_svg:not([class*='size-'])]:size-[14px]",
        "icon-sm": "size-7 p-0",
        "icon-lg": "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
