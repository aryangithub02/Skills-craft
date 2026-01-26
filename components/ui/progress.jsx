"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * Render a styled progress bar whose filled portion corresponds to the provided numeric value.
 *
 * @param {string} [className] - Additional CSS classes to apply to the root progress element.
 * @param {number} [value] - Progress value between 0 and 100; treated as 0 when undefined. Higher values reveal more of the filled indicator.
 * @param {object} [props] - Additional props spread onto the root progress element.
 * @returns {JSX.Element} The rendered progress bar element.
 */
function Progress({
  className,
  value,
  ...props
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
    </ProgressPrimitive.Root>
  );
}

export { Progress }