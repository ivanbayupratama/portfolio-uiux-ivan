// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-10 lg:pt-20 lg:pb-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 lg:gap-0 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-5 leading-tight">
              Let's build interfaces <br className="hidden md:block" /> that make sense.
            </h2>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8 max-w-lg leading-relaxed">Currently open for full-time roles and freelance opportunities. Drop a message if you want to collaborate or just say hi.</p>
            <a
              href="mailto:ivanbayu857@gmail.com"
              className="inline-flex items-center gap-3 font-semibold text-base px-7 py-3.5 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Send an Email <span className="text-lg">&rarr;</span>
            </a>
          </div>

          <div className="flex flex-col gap-3 text-base font-medium">
            <a
              href="https://linkedin.com/in/ivanbayupratama"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-2"
            >
              ↗ LinkedIn
            </a>
            <a
              href="https://github.com/ivanbayupratama"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-2"
            >
              ↗ GitHub
            </a>
            <a href="https://instagram.com/ivannby" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-2">
              ↗ Instagram
            </a>
            <a
              href="/CV-Ivan Bayu Pratama-ats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-2 mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800"
            >
              ↓ Download CV
            </a>
          </div>
        </div>

        {/* Baris Bawah (Bottom Line) */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">
          <p>&copy; 2026 Ivan Bayu Pratama. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 uppercase text-xs tracking-widest">
            <p>Cirebon &mdash; Bandung</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
