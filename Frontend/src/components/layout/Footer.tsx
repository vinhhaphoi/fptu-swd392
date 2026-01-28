import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: "Practice Tests", href: "/practice" },
      { label: "Mock Exams", href: "/mock-exam" },
      { label: "Progress Tracking", href: "/results" },
    ],
    Skills: [
      { label: "Listening", href: "/practice/listening" },
      { label: "Reading", href: "/practice/reading" },
      { label: "Writing", href: "/practice/writing" },
      { label: "Speaking", href: "/practice/speaking" },
    ],
    Support: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  };

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Vinhhaphoi
              </span>
            </Link>
            <p className="mt-4 text-foreground/60 text-sm leading-relaxed">
              Your comprehensive platform for VSTEP exam preparation. Practice
              all 4 skills with our AI-powered testing system.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-foreground font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-foreground/50 hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-card-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground/40 text-sm">
            Powered by Vinhhaphoi from NTHT x Vinhhaphoi
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-foreground/50 hover:text-foreground transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-foreground/50 hover:text-foreground transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
