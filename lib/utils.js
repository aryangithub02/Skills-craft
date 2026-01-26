import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Build a single className string by combining inputs and resolving Tailwind utility conflicts.
 *
 * @param {...any} inputs - Class names, arrays, objects, or falsy values accepted by clsx.
 * @returns {string} The merged className with Tailwind utilities de-duplicated and conflicts resolved.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}