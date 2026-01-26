import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a card container element with base styles and layout.
 * @param {string} className - Additional CSS class names to merge with the card's base styles.
 * @param {Object} [props] - Additional attributes and event handlers spread onto the root div.
 * @returns {JSX.Element} The card root element.
 */
function Card({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props} />
  );
}

/**
 * Renders the header slot of a Card component.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional CSS classes to merge with the header's base styles.
 * @returns {JSX.Element} A React element representing the card header.
 */
function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props} />
  );
}

/**
 * Renders the card title slot with base title typography and merged classes.
 * @param {string} className - Additional CSS class names to merge with the component's base title classes.
 * @param {object} props - Additional props to spread onto the root div element.
 * @returns {JSX.Element} A div element representing the card title slot.
 */
function CardTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props} />
  );
}

/**
 * Renders the card description slot with muted foreground and small text.
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to merge with the component's base styles.
 * @param {*} [props.props] - Remaining props are spread onto the root div.
 * @returns {JSX.Element} The description div element with `data-slot="card-description"`.
 */
function CardDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

/**
 * Action area container for a Card that positions controls (e.g., buttons) within the card layout.
 *
 * @param {string} [className] - Additional CSS classes to merge with the component's base positioning classes.
 * @param {Object} [props] - Additional props forwarded to the root div (e.g., event handlers, data attributes).
 * @returns {JSX.Element} The card action container element with positioning classes applied.
 */
function CardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props} />
  );
}

/**
 * Main content area for a Card component.
 *
 * @returns {JSX.Element} A div with data-slot="card-content" that applies horizontal padding and merges any provided `className`; additional props are spread onto the element.
 */
function CardContent({
  className,
  ...props
}) {
  return (<div data-slot="card-content" className={cn("px-6", className)} {...props} />);
}

/**
 * Render the footer area of a Card component.
 * @param {object} props
 * @param {string} [props.className] - Additional CSS classes to merge with the footer's base styles.
 * @returns {JSX.Element} A div element with data-slot="card-footer" and merged footer styles.
 */
function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}