import { cn } from "@/lib/utils"

/**
 * Render a presentational skeleton placeholder element.
 *
 * Renders a div with pulse animation, rounded corners, and a muted background.
 * Additional `className` values are appended to the default classes and any other
 * props are forwarded to the div.
 *
 * @param {string} className - Additional CSS classes appended to the default classes.
 * @param {Object} props - Additional props spread onto the rendered div.
 * @returns {JSX.Element} The skeleton div element.
 */
function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props} />)
  );
}

export { Skeleton }