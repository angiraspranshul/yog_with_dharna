"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="glass-effect sticky top-0 z-50 w-full transition-all duration-300 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
            ॐ
          </div>
          <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wide hover:opacity-90 transition-opacity">
            Yog with <span className="gold-gradient-text font-bold">Dhaarna</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-gold transition-colors text-foreground/80 hover:text-foreground">Home</Link>
          <Link href="/classes" className="hover:text-gold transition-colors text-foreground/80 hover:text-foreground">Classes</Link>
          <Link href="/book" className="hover:text-gold transition-colors text-foreground/80 hover:text-foreground">Book Class</Link>
          <Link href="/contact" className="hover:text-gold transition-colors text-foreground/80 hover:text-foreground">Contact</Link>
          
          <Link 
            href="/book" 
            className="ml-4 px-6 py-2.5 rounded-full gold-gradient-bg text-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 font-semibold"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden glass-effect border-b border-border absolute left-0 w-full py-6 px-6 flex flex-col gap-4 animate-fade-in-up shadow-lg">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)} 
            className="text-lg py-2 hover:text-gold font-medium transition-colors border-b border-border/40"
          >
            Home
          </Link>
          <Link 
            href="/classes" 
            onClick={() => setIsOpen(false)} 
            className="text-lg py-2 hover:text-gold font-medium transition-colors border-b border-border/40"
          >
            Classes
          </Link>
          <Link 
            href="/book" 
            onClick={() => setIsOpen(false)} 
            className="text-lg py-2 hover:text-gold font-medium transition-colors border-b border-border/40"
          >
            Book Class
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)} 
            className="text-lg py-2 hover:text-gold font-medium transition-colors border-b border-border/40"
          >
            Contact
          </Link>
          <Link 
            href="/book" 
            onClick={() => setIsOpen(false)} 
            className="w-full text-center py-3.5 rounded-full gold-gradient-bg text-white font-semibold hover:shadow-md transition-all duration-300 mt-2"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
