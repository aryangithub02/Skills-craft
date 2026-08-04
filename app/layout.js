
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Geist, Geist_Mono, Playfair_Display, DM_Sans } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkillsCraft - AI Career Coach",
  description: "AI-powered career coaching platform to help you build resumes, prepare for interviews, and land your dream job.",
};

import SessionProvider from "@/components/session-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSans.variable} antialiased`}
      >
        <NextTopLoader color="#3b82f6" showSpinner={false} />
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
