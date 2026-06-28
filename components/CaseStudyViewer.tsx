"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import FadeIn from "./FadeIn";

// 1. INTERFACE UPDATE
export interface CaseStudyData {
  title: string;
  role: string;
  duration: string;
  problem: string;
  outcome: string;
  images: string[];
  prototypeLink?: string;
}

export default function CaseStudyViewer({ data }: { data: CaseStudyData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === data.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? data.images.length - 1 : prev - 1));
  };

  // lock scroll website saat presentasi fullscreen dibuka
  useEffect(() => {
    if (isLightboxOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLightboxOpen]);

  // 2. KOMPONEN FULLSCREEN LIGHTBOX
  const Lightbox = (
    <AnimatePresence>
      {isLightboxOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-xl" onClick={() => setIsLightboxOpen(false)}>
          {/* Tombol Close */}
          <button className="absolute top-6 right-6 text-white hover:text-orange-500 z-50 p-2 transition-colors">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Gambar Presentasi */}
          <div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center">
            <img src={data.images[currentIndex]} alt="Slide Detail" className="max-w-full max-h-full object-contain drop-shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>

          {/* Navigasi Kiri/Kanan di Fullscreen  */}
          {data.images.length > 1 && (
            <>
              <button onClick={handlePrev} className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 md:left-auto md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* ================= SISI KIRI: SLIDER CANVAS ================= */}
        <div className="w-full md:w-[60%] lg:w-[65%]">
          <FadeIn direction="up" delay={0.2} className="relative group rounded-[2rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-900 shadow-xl cursor-pointer">
            <div className="relative w-full aspect-video md:aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={data.images[currentIndex]}
                  alt={`Slide ${currentIndex + 1}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* OVERLAY GLASSMORPHISM */}
            {data.images.length > 1 && (
              <>
                <div
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 backdrop-blur-[0px] group-hover:backdrop-blur-sm transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hidden md:flex"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <div className="flex flex-col items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                      </svg>
                    </div>
                    <span className="text-white font-bold tracking-widest text-sm drop-shadow-md">VIEW DETAILS</span>
                  </div>
                </div>
                <div className="absolute inset-0 md:hidden z-0" onClick={() => setIsLightboxOpen(true)}></div>
              </>
            )}

            {/* NAVIGASI PREV/NEXT  */}
            {data.images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-neutral-900 dark:text-white shadow-lg hover:scale-110 transition-transform z-10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-neutral-900 dark:text-white shadow-lg hover:scale-110 transition-transform z-10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                {/* DOTS INDICATOR */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 pointer-events-none">
                  {data.images.map((_, idx) => (
                    <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-orange-500" : "w-2 bg-white/50 backdrop-blur-sm"}`} />
                  ))}
                </div>
              </>
            )}
          </FadeIn>

          {/* HINT MOBILE: */}
          {data.images.length > 1 && (
            <FadeIn direction="up" delay={0.3} className="md:hidden mt-6 flex items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 animate-pulse">
                <path d="M15 3h6v6"></path>
                <path d="M9 21H3v-6"></path>
                <path d="M21 3l-7 7"></path>
                <path d="M3 21l7-7"></path>
              </svg>
              <span className="text-sm font-medium italic">Tap image to view full presentation</span>
            </FadeIn>
          )}

          {/* TEASER / WORK IN PROGRESS STATE */}
          {data.images.length === 1 && (
            <FadeIn direction="up" delay={0.3} className="mt-8 p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border-2 border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Detailed Case Study in Progress</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">The full design process, research data, and high-fidelity mockups for this project are currently being documented. Please check back soon!</p>
            </FadeIn>
          )}
        </div>

        {/* ================= SISI KANAN: PENJELASAN ================= */}
        <div className="w-full md:w-[40%] lg:w-[35%]">
          <div className="md:sticky md:top-32 space-y-12">
            {/* Header Judul & Info */}
            <FadeIn direction="left" delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight mb-6 text-neutral-900 dark:text-neutral-50">{data.title}</h1>
              <div className="flex flex-wrap gap-8">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">Role</span>
                  <p className="text-sm font-semibold">{data.role}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">Duration</span>
                  <p className="text-sm font-semibold">{data.duration}</p>
                </div>
              </div>
            </FadeIn>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            {/* Problem & Outcome */}
            <div className="space-y-10">
              <FadeIn direction="left" delay={0.2}>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  The Problem
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">{data.problem}</p>
              </FadeIn>

              <FadeIn direction="left" delay={0.3}>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  The Outcome
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">{data.outcome}</p>
              </FadeIn>
            </div>

            {data.prototypeLink && (
              <FadeIn direction="left" delay={0.4} className="pt-4">
                <a
                  href={data.prototypeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 w-full py-4 px-6 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-bold rounded-2xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
                    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path>
                    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path>
                    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 0 1-7 0z"></path>
                    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path>
                  </svg>
                  Try Interactive Prototype
                </a>
              </FadeIn>
            )}
          </div>
        </div>
      </div>

      {mounted && createPortal(Lightbox, document.body)}
    </div>
  );
}
