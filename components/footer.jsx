import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col gap-4 py-8 px-4 md:flex-row md:items-center md:justify-between">
        {/* Brand / Copyright */}
        <div className="flex flex-col gap-1">
          <Link href="/" className="font-bold text-lg">
            <span className="text-primary">Skills</span>Craft
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SkillsCraft. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </nav>

        {/* Social / Contact */}
        <div className="flex items-center gap-4 text-muted-foreground">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
