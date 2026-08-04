import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isProtectedRoute = 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/interview") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/resume") ||
    pathname.startsWith("/cover-letter") ||
    pathname.startsWith("/ai-cover-letter");

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/sign-in", req.nextUrl));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
