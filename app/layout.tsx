import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";
import { ThemeProvider } from "../components/ThemeProvider";
import Footer from "../components/Footer";

// @ts-ignore: allow global CSS side-effect import in Next.js layout
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portofolio UI/UX | Ivan Bayu Pratama",
  description: "Case studies and design explorations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F5F5F7] dark:bg-black text-neutral-900 dark:text-[#F2F2F7] transition-colors duration-500`}>
        <ThemeProvider>
          <Navbar />
          <ThemeToggle />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
