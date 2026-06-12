"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

/* Tabs aligned to tabs.md */
const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center text-[var(--body)] group-data-horizontal/tabs:h-10 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-[var(--neutral-secondary-soft)] rounded-[var(--radius-default)] p-1",
        line: "gap-0 bg-transparent border-b border-[var(--border-default)]",
        pills: "bg-[var(--neutral-secondary-soft)] rounded-full p-1",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex flex-1 items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 hover:text-[var(--heading)] data-active:text-[var(--fg-brand)] focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60",
        /* underline (line) */
        "group-data-[variant=line]/tabs-list:rounded-t-[var(--radius-default)] group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:data-active:border-[var(--border-brand)] group-data-[variant=line]/tabs-list:px-4 group-data-[variant=line]/tabs-list:py-3",
        /* default/pills active */
        "group-data-[variant=default]/tabs-list:data-active:bg-[var(--neutral-primary-soft)] group-data-[variant=default]/tabs-list:data-active:text-[var(--heading)] group-data-[variant=default]/tabs-list:rounded-[var(--radius-default)] group-data-[variant=default]/tabs-list:data-active:shadow-sm",
        "group-data-[variant=pills]/tabs-list:data-active:bg-[var(--brand)] group-data-[variant=pills]/tabs-list:data-active:text-white group-data-[variant=pills]/tabs-list:data-active:rounded-full group-data-[variant=pills]/tabs-list:data-active:shadow-sm",
        /* full width */
        "group-data-[variant=full]/tabs-list:border group-data-[variant=full]/tabs-list:border-[var(--border-default)] group-data-[variant=full]/tabs-list:data-active:bg-[var(--neutral-secondary-soft)] group-data-[variant=full]/tabs-list:first:rounded-l-[var(--radius-base)] group-data-[variant=full]/tabs-list:last:rounded-r-[var(--radius-base)]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
