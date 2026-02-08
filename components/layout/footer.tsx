import Link from "next/link"
import Image from "next/image"
import { Instagram, Linkedin, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 sm:py-12">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="MATH for AI Club"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-bold">MATH for AI Club</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A flagship event by MATH for AI Club - Where Mathematics meets Artificial Intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/register" className="hover:text-primary transition-colors">
                Register Now
              </Link>
              <Link href="/team" className="hover:text-primary transition-colors">
                Our Team
              </Link>
              <Link href="/admin" className="hover:text-primary transition-colors">
                Admin Portal
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <a href="mailto:socialmedia.cspit.aiml@charusat.ac.in" className="hover:text-primary transition-colors break-all text-xs sm:text-sm">
                  socialmedia.cspit.aiml@charusat.ac.in
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm">Seminar Hall 2nd Floor, CSPIT-A6 Building, CHARUSAT</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/aiml_cspit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/aimlcspit/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 MATH for AI Club - MathFlow AI Event. All rights reserved.</p>
          <p className="mt-1 text-xs">Website by Yug Thummar</p>
        </div>
      </div>
    </footer>
  )
}
