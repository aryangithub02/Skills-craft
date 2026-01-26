"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Render the Select root element that forwards all props to the underlying Radix Select primitive and marks it with a data-slot.
 *
 * @param {object} props - Props forwarded to the underlying Select primitive.
 * @returns {React.ReactElement} The Select root React element.
 */
function Select({
  ...props
}) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

/**
 * Render a select grouping container that forwards all received props and sets data-slot="select-group".
 * @param {object} props - Props forwarded to the rendered element.
 * @returns {JSX.Element} The select group element.
 */
function SelectGroup({
  ...props
}) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

/**
 * Renders a Radix Select Value element that forwards all received props and marks it with data-slot "select-value".
 * @param {object} props - Props forwarded to the underlying SelectPrimitive.Value component.
 * @returns {JSX.Element} The SelectPrimitive.Value element with data-slot "select-value".
 */
function SelectValue({
  ...props
}) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

/**
 * Render a styled select trigger with a dropdown icon and size variant.
 *
 * @param {string} [className] - Additional CSS classes to merge with the default styles.
 * @param {"default"|"sm"} [size="default"] - Size variant that controls the trigger's height.
 * @param {import('react').ReactNode} [children] - Content rendered inside the trigger.
 * @param {object} [props] - Additional props forwarded to the trigger element.
 * @returns {import('react').JSX.Element} The rendered select trigger element.
 */
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/**
 * Render the Select dropdown content inside a Portal with scroll controls and configurable positioning and alignment.
 *
 * @param {string} [className] - Additional CSS class names to apply to the content container.
 * @param {React.ReactNode} children - Elements to render inside the Select viewport.
 * @param {'item-aligned'|'popper'} [position="item-aligned"] - Layout positioning mode for the content.
 * @param {'start'|'center'|'end'} [align="center"] - Alignment of the content relative to the trigger.
 * @returns {JSX.Element} The Select content element rendered within a Portal.
 */
function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}>
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn("p-1", position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1")}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

/**
 * Render a Select label element with default text styling and a data-slot.
 *
 * Merges provided `className` with the component's base text styles and forwards remaining props to the underlying element.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to append to the base styles.
 * @returns {JSX.Element} The rendered Select label element.
 */
function SelectLabel({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props} />
  );
}

/**
 * Render a styled selectable item containing a left-aligned label and a right-aligned selection indicator.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the component's base styles.
 * @param {import('react').ReactNode} [props.children] - Content used as the item's visible label.
 * @returns {import('react').ReactElement} A Select item element with an item indicator and text slot.
 */
function SelectItem({
  className,
  children,
  ...props
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}>
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

/**
 * Render a styled separator for the Select component.
 * @param {string} [className] - Additional CSS classes to merge with the separator's base styles.
 * @returns {JSX.Element} A Select separator element with base border styling, pointer-events disabled, and any provided classes applied. 
 */
function SelectSeparator({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props} />
  );
}

/**
 * Render a select scroll-up button with default styling and an embedded ChevronUpIcon.
 * @param {string} [className] - Additional CSS classes to merge with the component's default styles.
 * @param {object} [props] - Additional props forwarded to the underlying Radix Select ScrollUpButton.
 * @returns {JSX.Element} The Select ScrollUpButton element containing a ChevronUpIcon.
 */
function SelectScrollUpButton({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}>
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

/**
 * Renders a styled Select scroll-down button with a downward chevron icon and a data-slot for integration.
 *
 * Forwards remaining props to the underlying Radix ScrollDownButton.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes applied to the button.
 * @returns {JSX.Element} The rendered scroll-down button element.
 */
function SelectScrollDownButton({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}>
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}