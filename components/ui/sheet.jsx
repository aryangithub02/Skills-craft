"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Render a Sheet root element using Radix UI's Sheet primitive and mark it with data-slot "sheet".
 * @param {Object} props - Props to be forwarded to the underlying SheetPrimitive.Root (e.g., children, open state, event handlers, and styling).
 * @returns {React.ReactElement} A React element for the Sheet root.
 */
function Sheet({
  ...props
}) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

/**
 * Render a sheet trigger element with a data-slot of "sheet-trigger".
 * @param {Object} props - Props forwarded to the trigger element (e.g., event handlers, className, children).
 * @returns {JSX.Element} A React element that acts as the sheet trigger.
 */
function SheetTrigger({
  ...props
}) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

/**
 * Render a sheet close trigger element.
 *
 * @param {object} props - Props forwarded to the close trigger element (for example `className`, `aria-label`, event handlers, etc.).
 * @returns {JSX.Element} A React element that acts as the sheet's close trigger.
 */
function SheetClose({
  ...props
}) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/**
 * Render a sheet portal element that mounts sheet content outside the DOM flow.
 *
 * @param {object} props - Props forwarded to the underlying SheetPrimitive.Portal.
 * @returns {JSX.Element} A SheetPrimitive.Portal element with data-slot="sheet-portal" and forwarded props.
 */
function SheetPortal({
  ...props
}) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/**
 * Render the sheet backdrop overlay with built-in open/close animations and translucent black background.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes merged with the overlay's default classes.
 * @returns {JSX.Element} The Sheet overlay element.
 */
function SheetOverlay({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} />
  );
}

/**
 * Renders the sheet's content area with side-specific slide animations and an optional close button.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional class names applied to the content container.
 * @param {import('react').ReactNode} props.children - Elements to display inside the sheet.
 * @param {'right'|'left'|'top'|'bottom'} [props.side='right'] - Side from which the sheet should appear.
 * @param {boolean} [props.showCloseButton=true] - Whether to include a close button inside the sheet.
 * @returns {JSX.Element} The rendered sheet content element.
 */
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}>
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

/**
 * Renders the header area for a sheet with default layout and padding.
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to merge with the default header styles.
 * @returns {JSX.Element} The sheet header element (a `div` with data-slot="sheet-header").
 */
function SheetHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props} />
  );
}

/**
 * Renders the footer area for a sheet with spacing, padding, and `mt-auto` to stick to the bottom.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional class names to merge with the default footer styles.
 * @returns {JSX.Element} The footer container element (`div`) with combined classes and forwarded props.
 */
function SheetFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props} />
  );
}

/**
 * Render a sheet title element with default typography and merged className.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the component's default typography styles.
 * @returns {JSX.Element} The sheet title element with a data-slot of "sheet-title".
 */
function SheetTitle({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props} />
  );
}

/**
 * Renders the sheet's description element with default styling and optional additional classes.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to merge with the default description styles.
 * @returns {JSX.Element} The rendered sheet description element.
 */
function SheetDescription({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}