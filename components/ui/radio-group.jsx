"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Wraps Radix UI's RadioGroup.Root with a grid layout and optional custom classes.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to append to the default layout classes.
 * @returns {JSX.Element} The configured RadioGroup.Root element with layout classes applied and all other props forwarded.
 */
function RadioGroup({
  className,
  ...props
}) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props} />
  );
}

/**
 * Render a styled radio-group item with a centered circular indicator.
 *
 * @param {string} [className] - Additional CSS classes to apply to the item container.
 * @param {object} [props] - Props forwarded to the underlying RadioGroupPrimitive.Item element.
 * @returns {JSX.Element} A radio-group item element containing a centered indicator icon.
 */
function RadioGroupItem({
  className,
  ...props
}) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}>
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center">
        <CircleIcon
          className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem }