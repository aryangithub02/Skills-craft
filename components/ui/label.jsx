"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

/**
 * Renders a styled label by wrapping Radix UI's LabelPrimitive.Root with default utility classes and merged user classes.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to merge with the component's default classes.
 * @returns {JSX.Element} The rendered LabelPrimitive.Root element with merged classes and forwarded props.
 */
function Label({
  className,
  ...props
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props} />
  );
}

export { Label }