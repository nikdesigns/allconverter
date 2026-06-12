import * as React from "react"

import { cn } from "@/lib/utils"

/* Cards per cards.md:
 * bg: neutral-primary-soft, border: 1px border-default, radius:12px (base), shadow-sm
 * Card heading: 20px (desktop)/16px (mobile) medium heading color
 * Interactive: hover -> neutral-secondary-medium + shadow-md , 200ms
 * Static: no hover styles
 */
function Card({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col overflow-hidden bg-[var(--neutral-primary-soft)] text-[var(--heading)] border border-[var(--border-default)] rounded-[var(--radius-base)] shadow-[var(--shadow-sm)]",
        interactive && "transition-all duration-200 cursor-pointer hover:bg-[var(--neutral-secondary-medium)] hover:shadow-[var(--shadow-md)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1 p-5 pb-0", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-medium text-[16px] sm:text-[20px] leading-snug text-[var(--heading)]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-[var(--body-subtle)]", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-5 pt-4 text-[var(--body)] text-sm", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center border-t border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] p-4 mt-auto rounded-b-[var(--radius-base)]", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
