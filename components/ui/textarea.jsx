import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a styled textarea that merges default utility classes with any additional classes and forwards all other props.
 * @param {string} className - Additional CSS classes to append to the component's default class list.
 * @param {object} props - Additional props forwarded to the underlying textarea element (e.g., value, onChange, placeholder, rows).
 * @returns {JSX.Element} The rendered textarea element.
 */
function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Textarea }