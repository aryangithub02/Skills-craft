"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders the dialog root element and marks it with a stable data-slot for composition.
 * @param {object} props - Props forwarded to the underlying DialogPrimitive.Root (e.g., children, open, onOpenChange).
 * @returns {JSX.Element} The DialogPrimitive.Root element with data-slot="dialog".
 */
function Dialog({
  ...props
}) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * Renders a Radix Dialog Trigger element with data-slot="dialog-trigger" and forwards all received props to it.
 * @param {object} props - Props to forward to the underlying DialogTrigger (e.g., event handlers, className, children).
 * @returns {JSX.Element} The rendered Dialog Trigger element.
 */
function DialogTrigger({
  ...props
}) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * Renders the dialog portal element.
 * @param {object} props - Props forwarded to the underlying portal element.
 * @returns {JSX.Element} The portal element with `data-slot="dialog-portal"` and forwarded props.
 */
function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * Renders a dialog close control with the data-slot "dialog-close".
 *
 * @param {object} props - Props forwarded to the close control element (e.g., `className`, event handlers).
 * @returns {JSX.Element} A React element that closes the dialog when activated.
 */
function DialogClose({
  ...props
}) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * Render a fullscreen dialog backdrop with built-in animation and default styling.
 *
 * Merges any provided `className` with the component's default utility classes and forwards remaining props to the underlying Radix Overlay.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the default overlay styles.
 * @returns {JSX.Element} The rendered DialogPrimitive.Overlay element with a `data-slot="dialog-overlay"` attribute.
 */
function DialogOverlay({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} />
  );
}

/**
 * Render dialog content inside a portal with an overlay and an optional close button.
 *
 * @param {string} [className] - Additional class names merged into the dialog content container.
 * @param {import('react').ReactNode} [children] - Elements to render inside the dialog content.
 * @param {boolean} [showCloseButton=true] - When true, renders a built-in close button in the top-right corner.
 * @param {object} [props] - Additional props forwarded to the underlying DialogPrimitive.Content element.
 * @returns {JSX.Element} The composed dialog content element including portal, overlay, and content.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          className
        )}
        {...props}>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * Renders the dialog header container with default layout and responsive text alignment.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to merge with the default header classes.
 * @returns {JSX.Element} A div element with data-slot="dialog-header" and composed class names.
 */
function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props} />
  );
}

/**
 * Renders a responsive dialog footer container that stacks controls vertically on small screens
 * and lays them out horizontally, justified to the end, on larger screens.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names to apply to the footer container.
 * @returns {JSX.Element} The dialog footer container element.
 */
function DialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props} />
  );
}

/**
 * Renders a styled dialog title element.
 *
 * @param {string} [className] - Additional CSS class names to append to the default title classes.
 * @param {object} [props] - Additional props forwarded to the underlying DialogPrimitive.Title.
 * @returns {JSX.Element} The rendered dialog title element.
 */
function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props} />
  );
}

/**
 * Renders a dialog description element with default muted, small text styling.
 * @param {string} [className] - Additional class names to append to the default styling.
 * @param {object} [props] - Additional props forwarded to the underlying description element.
 * @returns {JSX.Element} The rendered dialog description element.
 */
function DialogDescription({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}