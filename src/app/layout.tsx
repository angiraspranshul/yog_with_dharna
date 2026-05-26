import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Yog with Dhaarna | Premium Yoga & Meditation Booking",
  description: "Join professional yoga instructor Dhaarna for live classes designed to nurture balance, strength, and inner peace. Reserve your session today.",
  keywords: ["yoga classes", "meditation booking", "Dhaarna yoga", "Vinyasa flow", "Hatha yoga", "yin yoga"],
  openGraph: {
    title: "Yog with Dhaarna | Nurture Body & Mind",
    description: "Book dynamic Hatha flow, dynamic Vinyasa, or restorative meditation sessions with Dhaarna.",
    type: "website",
    locale: "en_IN",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-gold/20 selection:text-gold">
        {children}
      </body>
    </html>
  );
}
