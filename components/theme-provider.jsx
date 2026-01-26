"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Wraps children with the theme provider, forwarding all received props to the underlying provider.
 * @param {object} props - Component props.
 * @param {import('react').ReactNode} props.children - Elements to render inside the theme provider.
 * @param {object} [props.rest] - Additional props forwarded to the underlying theme provider.
 * @returns {import('react').ReactElement} A provider element that applies theme context to its children.
 */
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}