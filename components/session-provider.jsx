"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * Provides NextAuth session context to its React child subtree.
 *
 * @param {object} props - Component props.
 * @param {import('react').ReactNode} props.children - React nodes that will receive the session context.
 * @returns {JSX.Element} A SessionProvider component wrapping the given children.
 */
export default function SessionProvider({ children }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}