"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Render the accordion root element, applying a data-slot attribute and forwarding any provided props.
 * @param {object} props - Props to spread onto the accordion root element.
 * @returns {JSX.Element} A React element representing the accordion root.
 */
function Accordion({
  ...props
}) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

/**
 * Render a styled accordion item wrapper that applies base border styles and forwards all props to the rendered element.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the default border styles.
 * @returns {JSX.Element} A React element representing a styled accordion item.
 */
function AccordionItem({
  className,
  ...props
}) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props} />
  );
}

/**
 * Render an accordion header containing a styled trigger and a chevron icon that rotates when open.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names applied to the trigger element.
 * @param {import('react').ReactNode} [props.children] - Content displayed inside the trigger.
 * @param {...any} [props.rest] - Additional props forwarded to the underlying trigger element.
 * @returns {JSX.Element} The rendered accordion header and trigger element.
 */
function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}>
        {children}
        <ChevronDownIcon
          className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * Renders the accordion content area with state-driven open/close animations and inner padding.
 *
 * @param {string} [className] - Additional class names applied to the inner content wrapper.
 * @param {import('react').ReactNode} [children] - Elements displayed inside the accordion content.
 * @param {...any} props - Props forwarded to the underlying AccordionPrimitive.Content element.
 * @returns {JSX.Element} The rendered accordion content element.
 */
function AccordionContent({
  className,
  children,
  ...props
}) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}>
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }