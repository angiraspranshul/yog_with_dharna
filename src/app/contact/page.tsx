"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Simulate sending enquiry message to cloud
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatus("success");
    setName("");
    setEmail("");
    setMessage("");
    setLoading(false);
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 py-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        
        {/* Banner */}
        <div className="flex flex-col gap-3 mb-16 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Get in Touch
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Have questions about class levels, dynamic custom packages, or corporate wellness? Send Dhaarna a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start max-w-5xl mx-auto">
          
          {/* Contact Details (Left side - 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Connect Directly
            </h2>
            
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="flex gap-4.5 items-start">
                <div className="w-11 h-11 rounded-2xl border border-brand/25 bg-brand/5 flex items-center justify-center text-brand shadow-sm shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5 text-sm sm:text-base">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Email Address</span>
                  <a href="mailto:connect@yogwithdhaarna.com" className="text-muted hover:text-brand transition-colors">
                    connect@yogwithdhaarna.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4.5 items-start">
                <div className="w-11 h-11 rounded-2xl border border-brand/25 bg-brand/5 flex items-center justify-center text-brand shadow-sm shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5 text-sm sm:text-base">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Phone Number</span>
                  <a href="tel:+919876543210" className="text-muted hover:text-brand transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-4.5 items-start">
                <div className="w-11 h-11 rounded-2xl border border-brand/25 bg-brand/5 flex items-center justify-center text-brand shadow-sm shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5 text-sm sm:text-base">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Instagram Feed</span>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-brand transition-colors">
                    @yogwithdhaarna
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form (Right side - 7 cols) */}
          <div className="lg:col-span-7 glass-effect border border-border p-8 sm:p-10 rounded-3xl">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
              Send an Enquiry
            </h2>
            
            {status === "success" && (
              <div className="mb-6 p-4 text-center text-sm font-semibold text-emerald-600 border border-emerald-600/20 bg-emerald-500/5 rounded-2xl animate-fade-in-up">
                ✨ Thank you! Dhaarna will reach out to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="font-medium text-stone-700 dark:text-stone-300">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyanjali Sen"
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3.5 px-4.5 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-medium text-stone-700 dark:text-stone-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priyanjali@gmail.com"
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3.5 px-4.5 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="font-medium text-stone-700 dark:text-stone-300">
                  How can Dhaarna help you?
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your yoga history, targets, or custom plan requirements..."
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-border py-3.5 px-4.5 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-brand text-stone-950 dark:text-stone-50 resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl brand-gradient-bg text-white hover:shadow-lg transition-all duration-300 font-semibold transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 shadow-md mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin shrink-0"></span>
                    Sending message...
                  </>
                ) : (
                  <>Send Message</>
                )}
              </button>
            </form>
          </div>

        </div>

      </main>
      
      <Footer />
    </>
  );
}
