import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-stone-50/50 dark:bg-stone-950/20 py-16 px-6 sm:px-8 lg:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8">
        
        {/* Info Column */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full brand-gradient-bg flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
              ॐ
            </div>
            <span className="font-serif text-xl font-semibold tracking-wide">
              Yog with <span className="brand-gradient-text font-bold">Dhaarna</span>
            </span>
          </div>
          <p className="text-muted max-w-sm text-sm sm:text-base leading-relaxed mt-2">
            Providing premium holistic yoga and meditation practices to balance the nervous system, build dynamic core strength, and cultivate profound inner peacefulness.
          </p>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif font-semibold text-lg text-stone-900 dark:text-stone-100">Quick Links</h4>
          <nav className="flex flex-col gap-2.5 text-sm sm:text-base font-medium">
            <Link href="/" className="hover:text-brand transition-colors text-muted hover:text-foreground">Home</Link>
            <Link href="/classes" className="hover:text-brand transition-colors text-muted hover:text-foreground">Our Classes</Link>
            <Link href="/book" className="hover:text-brand transition-colors text-muted hover:text-foreground">Book A Session</Link>
            <Link href="/contact" className="hover:text-brand transition-colors text-muted hover:text-foreground">Contact</Link>
            <Link href="/admin" className="hover:text-brand transition-colors text-muted hover:text-foreground text-xs mt-2 opacity-50">Admin Panel</Link>
          </nav>
        </div>

        {/* Contact/Connect Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif font-semibold text-lg text-stone-900 dark:text-stone-100">Connect</h4>
          <div className="flex flex-col gap-2 text-sm sm:text-base text-muted">
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>connect@yogwithdhaarna.com</span>
            </p>
            <p className="flex items-center gap-2 mt-1">
              <svg className="w-5 h-5 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>+91 98765 43210</span>
            </p>
          </div>
          
          {/* Socials */}
          <div className="flex items-center gap-4 mt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full border border-border/80 text-muted hover:text-brand hover:border-brand transition-all duration-300"
              aria-label="Instagram Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto border-t border-border/50 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-muted/80 gap-4">
        <p>© {currentYear} Yog with Dhaarna. All rights reserved.</p>
        <p className="flex gap-4">
          <Link href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand transition-colors">Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
}
