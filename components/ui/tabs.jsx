"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

/**
 * Render the root container for a tabbed interface.
 *
 * @param {string} [className] - Additional CSS classes to apply to the root container.
 * @param {...any} props - Additional props forwarded to the underlying tabs root.
 * @returns {JSX.Element} A React element representing the tabs root (includes `data-slot="tabs"`).
 */
function Tabs({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props} />
  );
}

/**
 * Renders the tabs list container with default styling and optional additional classes.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names appended to the default list styles.
 * @returns {JSX.Element} A React element representing the tabs list.
 */
function TabsList({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props} />
  );
}

/**
 * Render a styled tab trigger element for use within a Tabs component.
 *
 * @param {string} [className] - Additional class names appended to the default styling.
 * @param {object} [props] - Remaining props forwarded to the trigger element.
 * @returns {JSX.Element} A React element representing a tab trigger.
 */
function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} />
  );
}

/**
 * Render the content panel for a tab.
 *
 * @param {string} [className] - Additional CSS classes applied to the content container.
 * @param {Object} [props] - Additional props forwarded to the underlying TabsPrimitive.Content element.
 * @returns {JSX.Element} The content panel element for a tab.
 */
function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props} />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }