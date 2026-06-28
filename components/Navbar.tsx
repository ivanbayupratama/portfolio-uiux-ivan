"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full py-4 px-8 flex flex-col md:flex-row md:justify-between md:items-center border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-md z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link href="/" className="relative flex items-center group" aria-label="Home" onClick={() => setIsOpen(false)}>
          <Image src="/images/logo.png" alt="Ivan Bayu Pratama Logo" width={40} height={40} />
        </Link>

        <button className="md:hidden p-2 text-neutral-600 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          <svg className={`w-6 h-6 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-90" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      <div
        className={`w-full md:w-auto flex flex-col md:flex-row gap-6 md:gap-8 text-sm font-medium text-neutral-500 text-center md:text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:overflow-visible overflow-hidden ${
          isOpen ? "max-h-96 opacity-100 mt-8" : "max-h-0 opacity-0 md:max-h-96 md:opacity-100 mt-0 md:mt-0"
        }`}
      >
        <Link href="/" className="dark:text-neutral-400 dark:hover:text-white hover:text-neutral-900 transition-colors" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link href="#about" className="dark:text-neutral-400 dark:hover:text-white hover:text-neutral-900 transition-colors" onClick={() => setIsOpen(false)}>
          About
        </Link>
        <Link href="#case-studies" className="dark:text-neutral-400 dark:hover:text-white hover:text-neutral-900 transition-colors" onClick={() => setIsOpen(false)}>
          Case Studies
        </Link>
      </div>
    </nav>
  );
}
