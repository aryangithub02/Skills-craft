import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Optional: Add logic here to redirect unauthenticated users
  // Note: With database sessions, req.auth might be null in middleware/Edge 
  // because it cannot access the DB to validate the session token.
  // Validation is best done in Layouts/Pages or via JWT check if we switched strategies.

  // const isLoggedIn = !!req.auth;
  // if (!isLoggedIn && req.nextUrl.pathname.startsWith("/dashboard")) {
  //   return Response.redirect(new URL("/api/auth/signin", req.nextUrl));
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
