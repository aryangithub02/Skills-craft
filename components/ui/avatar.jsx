"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Render an avatar container wrapping Radix Avatar's root with base layout styles and optional custom classes.
 * @param {string} className - Additional CSS classes appended to the avatar root's base classes.
 * @param {object} [props] - Additional props forwarded to the AvatarPrimitive.Root element.
 * @returns {JSX.Element} The AvatarPrimitive.Root element configured as the avatar container.
 */
function Avatar({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props} />
  );
}

/**
 * Render the avatar image element with base sizing classes and forwarded props.
 * @param {string} className - Additional CSS class names to merge with the component's base classes.
 * @param {Object} [props] - Additional props forwarded to the underlying AvatarPrimitive.Image element.
 * @returns {JSX.Element} The AvatarPrimitive.Image element configured for avatar display.
 */
function AvatarImage({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props} />
  );
}

/**
 * Render the avatar fallback element shown when the image is unavailable.
 *
 * Renders a circular placeholder inside the avatar root and forwards any props
 * (including className) to the underlying Radix Fallback primitive.
 * @returns {JSX.Element} The fallback element rendered inside the avatar root.
 */
function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props} />
  );
}

export { Avatar, AvatarImage, AvatarFallback }