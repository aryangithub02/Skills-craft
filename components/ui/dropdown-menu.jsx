"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Render a dropdown menu root element with data-slot "dropdown-menu" for testing or styling hooks.
 * @param {object} props - Props forwarded to the underlying root element.
 * @returns {JSX.Element} The dropdown menu root element.
 */
function DropdownMenu({
  ...props
}) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/**
 * Render a Portal wrapper for dropdown menu content.
 * @param {Object} props - Props forwarded to the underlying Radix Portal component.
 * @returns {JSX.Element} The Portal element for dropdown menu content with data-slot "dropdown-menu-portal".
 */
function DropdownMenuPortal({
  ...props
}) {
  return (<DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />);
}

/**
 * Renders a dropdown menu trigger element and applies a data-slot for testing/styling.
 * @param {object} props - Props forwarded to the underlying trigger element.
 * @returns {JSX.Element} The trigger element for the dropdown menu.
 */
function DropdownMenuTrigger({
  ...props
}) {
  return (<DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />);
}

/**
 * Render the dropdown menu content inside a Portal with consistent styling and a configurable offset from the trigger.
 * @param {string} [className] - Additional class names to merge with the component's default styles.
 * @param {number} [sideOffset=4] - Distance in pixels between the trigger and the content.
 * @param {Object} [props] - Additional props forwarded to the underlying Radix Content primitive.
 * @returns {JSX.Element} The mounted dropdown menu content element.
 */
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props} />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * Renders a grouping container for dropdown menu items.
 *
 * @param {object} props - Props forwarded to the rendered group element.
 * @returns {JSX.Element} The rendered dropdown menu group element.
 */
function DropdownMenuGroup({
  ...props
}) {
  return (<DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />);
}

/**
 * Render a styled dropdown menu item element with optional inset and visual variant.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the component's default styles.
 * @param {boolean} [props.inset] - If true, apply inset layout (adds left padding and data-inset attribute).
 * @param {string} [props.variant="default"] - Visual variant used for state-based styling (e.g., "destructive").
 * @returns {JSX.Element} A dropdown menu item element with applied styles, data attributes, and all other props forwarded to the underlying primitive.
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props} />
  );
}

/**
 * Render a styled dropdown menu checkbox item.
 *
 * @param {string} [className] - Additional CSS class names to merge with the component's base styles.
 * @param {import('react').ReactNode} [children] - Content to display for the item (label or nodes).
 * @param {boolean} [checked] - Whether the checkbox item is checked.
 * @returns {JSX.Element} The rendered DropdownMenu checkbox item element.
 */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}>
      <span
        className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/**
 * Renders a Radix DropdownMenu RadioGroup wrapper that forwards props and adds a data-slot attribute for testing/styling.
 * @param {object} props - Props passed through to the underlying Radix RadioGroup.
 * @returns {React.Element} A React element representing the dropdown menu radio group.
 */
function DropdownMenuRadioGroup({
  ...props
}) {
  return (<DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />);
}

/**
 * Renders a styled radio item for a dropdown menu with a circular selection indicator.
 * @param {{className?: string, children?: React.ReactNode}} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the item.
 * @param {React.ReactNode} [props.children] - Content displayed inside the radio item.
 * @returns {JSX.Element} The rendered dropdown menu radio item element.
 */
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>
      <span
        className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/**
 * Render a styled label for a dropdown menu, with optional inset spacing.
 * @param {string} [className] - Additional CSS classes to apply to the label.
 * @param {boolean} [inset] - When true, applies inset padding to align with indented items.
 * @returns {JSX.Element} The rendered dropdown menu label element.
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)}
      {...props} />
  );
}

/**
 * Render a styled separator for dropdown menus.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to append to the separator.
 * @returns {JSX.Element} The rendered separator element.
 */
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props} />
  );
}

/**
 * Renders a right-aligned shortcut label for a dropdown menu item.
 *
 * @returns {JSX.Element} A span element with shortcut styling and `data-slot="dropdown-menu-shortcut"`.
 */
function DropdownMenuShortcut({
  className,
  ...props
}) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props} />
  );
}

/**
 * Render a submenu wrapper that forwards all props and applies the data-slot "dropdown-menu-sub".
 * @param {object} props - Props to forward to the submenu primitive.
 * @returns {JSX.Element} The submenu element with forwarded props and the `data-slot="dropdown-menu-sub"` attribute.
 */
function DropdownMenuSub({
  ...props
}) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/**
 * Renders a submenu trigger element for a dropdown menu with consistent styling and a trailing chevron.
 *
 * @param {string} [className] - Additional CSS classes to apply to the trigger element.
 * @param {boolean} [inset] - When true, applies inset padding to align the trigger with inset menu items.
 * @param {import('react').ReactNode} [children] - Content to render inside the trigger.
 * @returns {JSX.Element} A styled submenu trigger element.
 */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}>
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

/**
 * Render a styled dropdown submenu content container.
 *
 * @param {Object} props - Props forwarded to the underlying SubContent primitive.
 * @param {string} [props.className] - Additional CSS class names to merge with the component's default styling.
 * @returns {JSX.Element} The rendered DropdownMenu SubContent element with merged classes and a data-slot attribute.
 */
function DropdownMenuSubContent({
  className,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props} />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}