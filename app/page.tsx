"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useAnimationFrame } from "framer-motion";
import FadeIn from "@/components/FadeIn";

// MENGIMPOR SEMUA DATA DARI LIB/DATA.TS
import { toolsData, skillsData, certificatesData, caseStudiesDB } from "@/lib/data";

// --- KOMPONEN 3D GLASSMORPHISM TILT ---
const TiltIconBox = ({ icon, colorClass }: { icon: ReactNode; colorClass: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);

  const handleMove = (e: any) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    x.set((clientX - rect.left) / rect.width - 0.5);
    y.set((clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="mb-2 md:mb-4 z-20 relative bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-[1.5rem] md:rounded-[1.8rem] h-fit">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchMove={handleMove}
        onTouchEnd={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative w-14 h-14 md:w-20 md:h-20 rounded-[1rem] md:rounded-3xl flex items-center justify-center cursor-grab active:cursor-grabbing
          backdrop-blur-xl 
          border border-white/60 dark:border-neutral-700/50 
          shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.03)]
          transition-colors duration-500 ${colorClass}`}
      >
        <motion.div style={{ transform: "translateZ(60px)" }} className="drop-shadow-2xl pointer-events-none scale-75 md:scale-110">
          {icon}
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- COASTER ITEM UNTUK SOFTWARE & TOOLS ---
const CoasterItem = ({ item, index, totalItems, coasterProgress, setIsCoasterHovered }: any) => {
  const offset = (index / totalItems) * 65;

  const distance = useTransform(coasterProgress, (p: number) => {
    return `${(p + offset) % 100}%`;
  });

  // SAFETY CHECK: Mencegah TypeError jika icon undefined di data.ts
  if (!item || !item.icon) return null;

  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-auto"
      style={{
        offsetPath: "path('M -100 300 L 500 300 C 600 300, 800 200, 645 50 C 400 0, 400 300, 700 300 L 1300 300')",
        offsetRotate: "0deg",
        offsetDistance: distance,
      }}
    >
      <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/icon cursor-pointer" onMouseEnter={() => setIsCoasterHovered(true)} onMouseLeave={() => setIsCoasterHovered(false)}>
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-[1rem] md:rounded-[1.5rem] flex items-center justify-center shadow-md text-neutral-700 dark:text-neutral-300 transition-transform duration-300 group-hover/icon:scale-125 group-hover/icon:-translate-y-2 group-hover/icon:shadow-xl group-hover/icon:border-neutral-400 dark:group-hover/icon:border-neutral-500">
          <item.icon className="w-6 h-6 md:w-8 md:h-8 transition-colors" />
        </div>

        <span className="mt-2 text-[10px] md:text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100/90 dark:bg-neutral-800/90 px-3 py-1 rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity backdrop-blur-md whitespace-nowrap shadow-sm border border-neutral-200 dark:border-neutral-700">
          {item.name}
        </span>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const targetRef = useRef(null);
  const approachScrollRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  // --- Animasi Coaster Software & Tools ---
  const [isCoasterHovered, setIsCoasterHovered] = useState(false);
  const coasterProgress = useMotionValue(0);
  const coasterSpeed = useSpring(0.0035, { stiffness: 40, damping: 15, mass: 1 });

  useEffect(() => {
    coasterSpeed.set(isCoasterHovered ? 0 : 0.004);
  }, [isCoasterHovered, coasterSpeed]);

  useAnimationFrame((time, delta) => {
    let newProgress = coasterProgress.get() + coasterSpeed.get() * delta;
    if (newProgress >= 100) newProgress -= 100;
    coasterProgress.set(newProgress);
  });

  const duplicatedTools = [...toolsData, ...toolsData, ...toolsData];

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] });
  const parallaxBackdrop = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const parallaxForegroundFast = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // --- LOGIKA MOBILE CORE APPROACH ZIG-ZAG ---
  const { scrollYProgress: approachScrollMobile } = useScroll({
    target: approachRef,
    offset: ["start 85%", "end 60%"],
  });

  const n1Op = useTransform(approachScrollMobile, [0.0, 0.14], [0, 1]);
  const l1Scale = useTransform(approachScrollMobile, [0.14, 0.28], [0, 1]);
  const n2Op = useTransform(approachScrollMobile, [0.28, 0.42], [0, 1]);
  const l2Scale = useTransform(approachScrollMobile, [0.42, 0.56], [0, 1]);
  const n3Op = useTransform(approachScrollMobile, [0.56, 0.7], [0, 1]);
  const l3Scale = useTransform(approachScrollMobile, [0.7, 0.84], [0, 1]);
  const n4Op = useTransform(approachScrollMobile, [0.84, 0.98], [0, 1]);

  // --- LOGIKA UTAMA: HORIZONTAL SCROLL CORE APPROACH DESKTOP ---
  const { scrollYProgress: roadScrollProgress } = useScroll({
    target: approachScrollRef,
    offset: ["start start", "end end"],
  });

  const roadXTransform = useTransform(roadScrollProgress, [0, 1], ["calc(0vw - 0%)", "calc(100vw - 100%)"]);

  useEffect(() => {
    if (selectedCert) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedCert]);

  const modalOverlay = (
    <AnimatePresence>
      {selectedCert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pt-16 md:p-8 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedCert(null)}
        >
          <motion.div
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col md:flex-row transition-colors duration-500"
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-full flex items-center justify-center transition-colors duration-500 z-50 shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="w-full md:w-1/2 bg-neutral-100 dark:bg-neutral-950 p-6 pt-16 md:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 transition-colors duration-500 shrink-0">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-neutral-200 dark:border-neutral-800 bg-white transition-colors duration-500">
                <img src={selectedCert.image} alt={selectedCert.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-xl text-neutral-900 dark:text-neutral-50 mb-6 transition-colors duration-500">
                {selectedCert.issuer.charAt(0)}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 leading-snug transition-colors duration-500">{selectedCert.title}</h3>
              <p className="text-lg font-medium text-neutral-900 dark:text-neutral-200 mb-6 transition-colors duration-500">{selectedCert.issuer}</p>
              <div className="space-y-4 mb-8 text-sm md:text-base text-neutral-600 dark:text-neutral-400 transition-colors duration-500">
                <p>
                  <strong>Issued:</strong> {selectedCert.date}
                </p>
                <p>
                  <strong>Credential ID:</strong> <span className="font-mono text-neutral-500">{selectedCert.credentialId}</span>
                </p>
              </div>
              <div className="w-8 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-6 transition-colors duration-500"></div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 transition-colors duration-500">{selectedCert.description}</p>
              <a
                href={selectedCert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-4 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 font-bold rounded-xl hover:scale-[1.02] transition-all shadow-md mt-auto duration-500"
              >
                Show Credential
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <main className="relative bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-500" suppressHydrationWarning>
      <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full opacity-[0.9] dark:opacity-[0.4] dark:invert bg-[length:256px_256px] bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-neutral-50 dark:from-neutral-950 to-transparent transition-colors duration-500"></div>
      </div>

      {/* 1. HERO SECTION */}
      <section ref={targetRef} className="relative z-10 w-full h-[85dvh] md:h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-[1600px] max-h-[850px] md:max-h-[900px] flex items-center justify-center mx-auto">
          <motion.div style={{ y: parallaxBackdrop }} className="absolute top-[16%] md:top-[15%] lg:top-[12%] left-1/2 -translate-x-1/2 w-full text-center z-0 pointer-events-none select-none px-2">
            <motion.h1
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[5.5rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] xl:text-[13rem] font-serif italic tracking-tighter text-neutral-900/10 dark:text-neutral-50/10 leading-none whitespace-nowrap transition-colors duration-500"
            >
              Hey there,
            </motion.h1>
          </motion.div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[105%] sm:w-[85%] md:w-[48%] lg:w-[42%] max-w-[800px] z-10 flex justify-center items-end pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[70%] bg-neutral-300/40 dark:bg-white/10 rounded-[100%] blur-[80px] -z-10 transition-colors duration-500"></div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="w-full h-full pointer-events-auto flex items-end justify-center">
              <Image
                src="/images/my-photo.png"
                alt="Ivan Bayu Pratama"
                width={800}
                height={1000}
                priority
                className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_20px_30px_rgba(255,255,255,0.05)] transition-all duration-500"
              />
            </motion.div>
          </div>

          <div className="absolute inset-0 w-full h-full max-w-[1400px] mx-auto px-4 md:px-12 pointer-events-none z-20">
            <motion.div style={{ y: parallaxForegroundFast }} className="absolute bottom-[16%] md:bottom-[15%] left-4 sm:left-6 md:left-12 pointer-events-auto z-20">
              <motion.h2
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-[4rem] sm:text-[5rem] md:text-[6rem] lg:text-[7.5rem] font-black sentence-case leading-[0.85] tracking-tighter text-neutral-900 dark:text-neutral-50 drop-shadow-xl transition-colors duration-500"
              >
                I'm <br /> Ivan
              </motion.h2>
            </motion.div>

            <motion.div style={{ y: parallaxForegroundFast }} className="absolute bottom-[16%] md:bottom-[15%] right-4 sm:right-6 md:right-16 lg:right-24 flex flex-col items-end gap-2 md:gap-6 pointer-events-auto z-20">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="px-3 md:px-5 py-2 bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center gap-2 shadow-sm transition-colors duration-500"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-[9px] md:text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors duration-500">Available for new opportunities</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-end gap-0 md:gap-1">
                <span className="text-xl sm:text-2xl md:text-3xl font-serif italic text-neutral-500 dark:text-neutral-400 -mb-1 md:-mb-2 z-10 transition-colors duration-500">Enthusiast</span>
                <h2 className="text-[1.1rem] sm:text-[1.8rem] md:text-[2rem] lg:text-[2.5rem] font-black uppercase leading-none tracking-tighter text-neutral-900 dark:text-neutral-50 text-right drop-shadow-xl transition-colors duration-500">
                  UI UX & <br /> SYSTEM ANALYST
                </h2>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT ME SECTION */}
      <section id="about" className="relative z-10 py-20 md:py-32 px-6 md:px-8 max-w-6xl mx-auto scroll-mt-16">
        <FadeIn direction="up">
          <div className="flex justify-between items-end mb-10 md:mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-3 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">About Me</h2>
              <p className="text-sm md:text-lg text-neutral-500 dark:text-neutral-400 transition-colors duration-500">The analytical mind driving intuitive interfaces</p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(140px,auto)] md:auto-rows-[minmax(250px,auto)] group/bento">
          <FadeIn direction="left" delay={0.3} className="col-span-2 md:col-span-2 row-span-2 md:row-span-1">
            <div className="h-full bg-white dark:bg-neutral-900 p-6 md:p-12 rounded-[2rem] md:rounded-4xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center transition-colors shadow-sm">
              <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-neutral-900 dark:text-neutral-50 tracking-tight">The Logical Framework</h3>
              <div className="space-y-3 md:space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs md:text-base">
                <p>
                  As a UI/UX Designer and System Analyst based in Bandung (originally from Cirebon), my approach to design is heavily rooted in logical frameworks. Before initiating any design iteration, I prioritize in-depth research with
                  stakeholders utilizing various applicable methodologies.
                </p>
                <p className="hidden md:block">
                  I argue that exceptional design is not just about visual aesthetics; it must be fundamentally relevant and address actual needs. This requires navigating data structures, system limitations, and logical workflows. This
                  combined foundation of empirical research and technical understanding allows me to craft solutions that are both intuitive for users and feasible for developers.
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.4} className="col-span-1 row-span-2 md:row-span-1 h-full min-h-[160px] md:min-h-full">
            <div className="relative h-full w-full rounded-[2rem] md:rounded-4xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 shadow-sm">
              <div className="absolute inset-0 bg-[url('/images/Work.jpeg')] bg-cover bg-center"></div>
            </div>
          </FadeIn>
          <FadeIn direction="left" delay={0.5} className="col-span-1 row-span-2 md:row-span-1 h-full min-h-[160px] md:min-h-full">
            <div className="relative h-full w-full rounded-[2rem] md:rounded-4xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 shadow-sm">
              <div className="absolute inset-0 bg-[url('/images/GDGOC.jpeg')] bg-cover bg-center"></div>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.6} className="col-span-2 md:col-span-2 h-full">
            <div className="h-full bg-neutral-900 dark:bg-neutral-50 p-6 md:p-12 rounded-[2rem] md:rounded-4xl border border-neutral-800 dark:border-neutral-200 flex flex-col justify-center transition-colors shadow-xl">
              <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-white dark:text-neutral-900 tracking-tight">Leadership & Collaboration</h3>
              <div className="space-y-3 md:space-y-4 text-neutral-300 dark:text-neutral-600 leading-relaxed text-xs md:text-base">
                <p>
                  Design is rarely a solo endeavor. During my tenure as the Media Creative Staff at GDG (Google Developer Groups) on Campus Pasundan University, I was responsible for translating complex, tech-centric initiatives into
                  engaging visual communications.
                </p>
                <p>Having completed my term, I now carry forward that experience as a critical foundation for aligning differing stakeholder opinions and navigating collaborative team dynamics in fast-paced environments.</p>
              </div>
              <div className="mt-6 md:mt-auto md:pt-12 flex items-center gap-3 opacity-50">
                <span className="w-8 md:w-12 h-[2px] bg-neutral-500"></span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white dark:text-neutral-900">Community & Impact</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ========================================= */}
      {/* 3. TOOLS & SOFTWARE SECTION */}
      {/* ========================================= */}
      <section className="relative z-10 py-20 md:py-32 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 overflow-hidden flex flex-col transition-colors duration-500">
        <FadeIn direction="up">
          <div className="text-center px-8 mb-4 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Software & Tools</h2>
          </div>
        </FadeIn>

        {/* --- DESKTOP: ROLLER COASTER LAYOUT --- */}
        <div className="hidden sm:flex relative w-full h-[400px] overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] mt-8 justify-center items-center">
          <div className="relative w-[1200px] h-[400px] shrink-0 pointer-events-none">
            {duplicatedTools.map((item, index) => (
              <CoasterItem key={index} item={item} index={index} totalItems={duplicatedTools.length} coasterProgress={coasterProgress} setIsCoasterHovered={setIsCoasterHovered} />
            ))}
          </div>
        </div>

        {/* --- MOBILE: MENDATAR --- */}
        <FadeIn direction="up" delay={0.2} className="sm:hidden mt-4">
          <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div className="flex w-max hover:[animation-play-state:paused]" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 15 }}>
              <div className="flex w-max gap-4 pr-4">
                {toolsData.map((item, index) => (
                  <div
                    key={`block1-${index}`}
                    className="flex items-center gap-2 px-5 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-600 dark:text-neutral-400 font-medium whitespace-nowrap shadow-sm transition-colors duration-500"
                  >
                    <span>
                      <item.icon className="w-5 h-5" />
                    </span>
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="flex w-max gap-4 pr-4">
                {toolsData.map((item, index) => (
                  <div
                    key={`block2-${index}`}
                    className="flex items-center gap-2 px-5 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-600 dark:text-neutral-400 font-medium whitespace-nowrap shadow-sm transition-colors duration-500"
                  >
                    <span>
                      <item.icon className="w-5 h-5" />
                    </span>
                    {item.name}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </section>

      {/* 4. TECHNICAL SKILLS SECTION */}
      <section className="relative z-10 py-20 md:py-32 border-t border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Technical Skills</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 md:gap-y-10 max-w-4xl mx-auto">
            {skillsData.map((skill, idx) => (
              <FadeIn direction="up" delay={0.1 * idx} key={idx}>
                <motion.div initial="initial" whileInView="animate" viewport={{ once: true, margin: "-50px" }} className="py-1">
                  <div className="flex justify-between items-center mb-2 md:mb-3">
                    <span className="font-semibold text-base md:text-lg text-neutral-700 dark:text-neutral-300 transition-colors duration-500">{skill.name}</span>
                    <motion.span
                      variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="text-xs md:text-sm font-bold text-neutral-400 dark:text-neutral-500 transition-colors duration-500"
                    >
                      {skill.level}%
                    </motion.span>
                  </div>
                  <div className="h-1.5 md:h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors duration-500">
                    <motion.div
                      variants={{ initial: { width: "0%" }, animate: { width: `${skill.level}%` } }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      className="h-full bg-neutral-900 dark:bg-neutral-50 rounded-full transition-colors duration-500"
                    />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 5. CORE APPROACH SECTION */}
      {/* ========================================= */}
      {/* sm:h-[250vh] HANYA berlaku untuk Desktop agar ada ruang scroll horizontal. Di Mobile, ini diabaikan agar tidak nge-bug */}
      <section ref={approachScrollRef} className="relative z-10 py-20 md:py-0 sm:h-[250vh] bg-neutral-50 dark:bg-[#0a0a0a] transition-colors duration-500">
        {/* CSS KEYFRAME UNTUK ANIMASI "ISI DAYA / LOADING" PADA GARIS */}
        <style>{`
          @keyframes chargingFlow {
            from { stroke-dashoffset: 40; }
            to { stroke-dashoffset: 0; }
          }
          .animate-charging {
            animation: chargingFlow 0.8s linear infinite;
          }
        `}</style>

        {/* sm:sticky sm:h-screen HANYA berlaku untuk Desktop. Di mobile akan mengalir normal (tidak tertahan) */}
        <div className="sm:sticky sm:top-0 sm:h-screen flex flex-col justify-center overflow-hidden">
          <div className="text-center mb-10 md:mb-6 relative z-20 px-6 md:px-8 shrink-0">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-3 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Core Approach</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-xs md:text-sm transition-colors duration-500">A systematic workflow ensuring every interface is logically sound before it becomes visually stunning.</p>
          </div>

          {/* --- DESKTOP: HORIZONTAL SCROLL WINDING ROAD --- */}
          <div className="hidden sm:block relative w-full h-[380px] overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <motion.div style={{ x: roadXTransform }} className="absolute top-0 left-0 w-[1800px] h-full flex items-center">
              <svg viewBox="0 0 1800 380" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm">
                <defs>
                  {/* MASKING: Untuk memastikan animasi "charging" hanya terlihat pada garis yang sudah dilewati */}
                  <mask id="progressMask">
                    <motion.path
                      d="M 0 190 C 150 190, 200 270, 350 270 C 500 270, 600 110, 750 110 C 900 110, 1000 270, 1150 270 C 1300 270, 1400 110, 1550 110 C 1700 110, 1750 190, 1800 190"
                      fill="none"
                      stroke="white"
                      strokeWidth="60"
                      strokeLinecap="round"
                      style={{ pathLength: roadScrollProgress }}
                    />
                  </mask>
                </defs>

                {/* 1. Base Road (Jalan Dasar abu-abu gelap) */}
                <path
                  d="M 0 190 C 150 190, 200 270, 350 270 C 500 270, 600 110, 750 110 C 900 110, 1000 270, 1150 270 C 1300 270, 1400 110, 1550 110 C 1700 110, 1750 190, 1800 190"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="28"
                  strokeLinecap="round"
                  className="text-neutral-200 dark:text-neutral-800"
                />

                {/* 2. Solid Blue Line (Garis Progress BIRU SOLID) */}
                <motion.path
                  d="M 0 190 C 150 190, 200 270, 350 270 C 500 270, 600 110, 750 110 C 900 110, 1000 270, 1150 270 C 1300 270, 1400 110, 1550 110 C 1700 110, 1750 190, 1800 190"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="28"
                  strokeLinecap="round"
                  style={{ pathLength: roadScrollProgress }}
                />

                {/* 3. Animasi "Loading/Isi Daya" (Biru terang mengalir di dalam bar) */}
                <path
                  d="M 0 190 C 150 190, 200 270, 350 270 C 500 270, 600 110, 750 110 C 900 110, 1000 270, 1150 270 C 1300 270, 1400 110, 1550 110 C 1700 110, 1750 190, 1800 190"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeDasharray="40 60"
                  mask="url(#progressMask)"
                  className="opacity-50 animate-charging"
                />
              </svg>

              {/* NODE 01 (Lembah) */}
              <motion.div
                className="absolute top-[270px] left-[350px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                style={{
                  opacity: useTransform(roadScrollProgress, [0.1, 0.18], [0, 1]),
                  scale: useTransform(roadScrollProgress, [0.1, 0.18], [0.8, 1]),
                }}
              >
                <div className="absolute bottom-[calc(100%+16px)] text-center w-48 md:w-56">
                  <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase">Step 01</span>
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-50 transition-colors duration-500">System Analysis</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm mt-0.5 leading-relaxed transition-colors duration-500">Deconstructing user flows, database structures, and constraints.</p>
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-neutral-900 border-[8px] border-blue-500 rounded-full flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 z-10">
                  <svg className="w-7 h-7 md:w-9 md:h-9 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </motion.div>

              {/* NODE 02 (Puncak) */}
              <motion.div
                className="absolute top-[110px] left-[750px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                style={{
                  opacity: useTransform(roadScrollProgress, [0.35, 0.43], [0, 1]),
                  scale: useTransform(roadScrollProgress, [0.35, 0.43], [0.8, 1]),
                }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-neutral-900 border-[8px] border-blue-500 rounded-full flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 z-10">
                  <svg className="w-7 h-7 md:w-9 md:h-9 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="absolute top-[calc(100%+16px)] text-center w-48 md:w-56">
                  <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase">Step 02</span>
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-50 transition-colors duration-500">UX Research</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm mt-0.5 leading-relaxed transition-colors duration-500">Mapping user journeys and wireframing for frictionless navigation.</p>
                </div>
              </motion.div>

              {/* NODE 03 (Lembah) */}
              <motion.div
                className="absolute top-[270px] left-[1150px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                style={{
                  opacity: useTransform(roadScrollProgress, [0.55, 0.63], [0, 1]),
                  scale: useTransform(roadScrollProgress, [0.55, 0.63], [0.8, 1]),
                }}
              >
                <div className="absolute bottom-[calc(100%+16px)] text-center w-48 md:w-56">
                  <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase">Step 03</span>
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-50 transition-colors duration-500">UI Prototyping</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm mt-0.5 leading-relaxed transition-colors duration-500">Translating wireframes into interactive, high-fidelity designs.</p>
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-neutral-900 border-[8px] border-blue-500 rounded-full flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 z-10">
                  <svg className="w-7 h-7 md:w-9 md:h-9 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* NODE 04 (Puncak) */}
              <motion.div
                className="absolute top-[110px] left-[1550px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                style={{
                  opacity: useTransform(roadScrollProgress, [0.78, 0.86], [0, 1]),
                  scale: useTransform(roadScrollProgress, [0.78, 0.86], [0.8, 1]),
                }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-neutral-900 border-[8px] border-blue-500 rounded-full flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110 z-10">
                  <svg className="w-8 h-8 md:w-10 md:h-10 relative top-px text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div className="absolute top-[calc(100%+16px)] text-center w-48 md:w-56">
                  <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase">Step 04</span>
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Dev Handoff</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm mt-0.5 leading-relaxed transition-colors duration-500">Delivering comprehensive design systems to accelerate execution.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* --- MOBILE: ZIG-ZAG --- */}
          {/* Di mobile, section ini akan mengalir normal (smooth). Interval dibagi rata 14%. */}
          <div ref={approachRef} style={{ position: "relative" }} className="sm:hidden w-full max-w-[340px] mx-auto flex flex-col relative z-10 pt-2 pb-2">
            <div className="flex justify-between relative w-full">
              <div className="absolute top-[28px] left-[calc(25%+36px)] right-[calc(25%+36px)] h-[2px] bg-neutral-200 dark:bg-neutral-800 z-0">
                <motion.div style={{ scaleX: l1Scale, transformOrigin: "left" }} className="w-full h-full bg-blue-500" />
              </div>

              <motion.div style={{ opacity: n1Op }} className="flex flex-col items-center text-center w-1/2 z-10 px-1">
                <TiltIconBox
                  colorClass="text-blue-500 border-blue-500"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  }
                />
                <h3 className="text-[12px] font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">1. System Analysis</h3>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">Deconstructing flows & data.</p>
              </motion.div>

              <motion.div style={{ opacity: n2Op }} className="flex flex-col items-center text-center w-1/2 z-10 px-1">
                <TiltIconBox
                  colorClass="text-blue-500 border-blue-500"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
                <h3 className="text-[12px] font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">2. UX Research</h3>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">Mapping user journeys.</p>
              </motion.div>
            </div>

            <div className="h-10 w-full relative flex justify-end pr-[calc(25%-1px)] my-1">
              <div className="w-[2px] h-full bg-neutral-200 dark:bg-neutral-800">
                <motion.div style={{ scaleY: l2Scale, transformOrigin: "top" }} className="w-full h-full bg-blue-500" />
              </div>
            </div>

            <div className="flex flex-row-reverse justify-between relative w-full">
              <div className="absolute top-[28px] left-[calc(25%+36px)] right-[calc(25%+36px)] h-[2px] bg-neutral-200 dark:bg-neutral-800 z-0">
                <motion.div style={{ scaleX: l3Scale, transformOrigin: "right" }} className="w-full h-full bg-blue-500" />
              </div>

              <motion.div style={{ opacity: n3Op }} className="flex flex-col items-center text-center w-1/2 z-10 px-1">
                <TiltIconBox
                  colorClass="text-blue-500 border-blue-500"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                  }
                />
                <h3 className="text-[12px] font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">3. UI Prototyping</h3>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">Interactive designs.</p>
              </motion.div>

              <motion.div style={{ opacity: n4Op }} className="flex flex-col items-center text-center w-1/2 z-10 px-1">
                <TiltIconBox
                  colorClass="text-blue-500 border-blue-500"
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  }
                />
                <h3 className="text-[12px] font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">4. Dev Handoff</h3>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">Design systems delivery.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CERTIFICATIONS SECTION */}
      <section className="relative z-10 py-20 md:py-32 px-6 md:px-8 max-w-6xl mx-auto border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 md:mb-12 gap-2 md:gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-3 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Certifications</h2>
              <p className="text-sm md:text-lg text-neutral-500 dark:text-neutral-400 transition-colors duration-500">Formal validations of my technical expertise.</p>
            </div>
            <p className="text-xs md:text-sm font-medium text-neutral-400 dark:text-neutral-500 transition-colors duration-500">Tap image to view details</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {certificatesData.map((cert, index) => (
            <FadeIn direction="up" delay={0.1 * index} key={cert.id}>
              <motion.div
                onClick={() => setSelectedCert(cert)}
                className="group cursor-pointer relative aspect-[4/3] rounded-[1.5rem] md:rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-500 bg-white dark:bg-neutral-900"
              >
                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500 flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100">
                  <div className="flex flex-col items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white mb-1 md:mb-2" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-white font-bold text-xs md:text-sm tracking-wide">View Credential</span>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 7. CASE STUDIES SECTION */}
      <section id="case-studies" className="relative z-10 py-20 md:py-32 px-6 md:px-8 max-w-[1400px] mx-auto border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500 scroll-mt-16 overflow-hidden">
        <FadeIn direction="up">
          <div className="flex flex-row justify-between items-end mb-8 md:mb-12 max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-3 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Case Studies</h2>
              <p className="text-sm md:text-lg text-neutral-500 dark:text-neutral-400 transition-colors duration-500">Selected works highlighting problem-solving and functional design.</p>
            </div>
          </div>
        </FadeIn>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-5 no-scrollbar pb-8 -mx-6 px-6 md:mx-auto md:px-0 max-w-6xl items-start">
          {Object.entries(caseStudiesDB).map(([slug, project]) => (
            <motion.div
              key={slug}
              whileHover={{ y: -5 }}
              className="flex-none w-[80vw] sm:w-[280px] md:w-[320px] snap-center bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-[1.5rem] md:rounded-[1.8rem] p-2 md:p-2.5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group/card h-fit"
            >
              <div className="relative w-full rounded-[1rem] md:rounded-[1.2rem] overflow-hidden group/image">
                <img src={project.images[0]} alt={project.title} className="w-full h-auto block transition-transform duration-700 group-hover/image:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 flex justify-between items-end gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-white leading-tight truncate mb-1">{project.title.split(" - ")[0]}</h3>
                    <div className="flex items-center gap-1.5 text-white/80 text-[10px] md:text-xs font-medium">
                      <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{project.role}</span>
                    </div>
                  </div>
                  <Link
                    href={`/case-studies/${slug}`}
                    className="shrink-0 flex items-center gap-1 bg-white text-neutral-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[9px] md:text-[11px] font-bold hover:bg-neutral-100 hover:scale-105 transition-all shadow-md"
                  >
                    View Study{" "}
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="px-2 pt-3 pb-1">
                <div className="flex gap-4 md:gap-5 mb-2">
                  <div>
                    <span className="block text-[9px] md:text-[10px] text-neutral-400 font-medium mb-0.5">Focus</span>
                    <span className="block text-[11px] md:text-xs font-bold text-neutral-700 dark:text-neutral-200">{project.role.split(" ")[0]}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] md:text-[10px] text-neutral-400 font-medium mb-0.5">Platform</span>
                    <span className="block text-[11px] md:text-xs font-bold text-neutral-700 dark:text-neutral-200">Cross-Platform</span>
                  </div>
                </div>
                <p className="text-[10px] md:text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">{project.outcome}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center text-[10px] md:text-xs text-neutral-400 mt-2 animate-pulse">Drag or swipe left to explore projects &rarr;</div>
      </section>

      {mounted && createPortal(modalOverlay, document.body)}
    </main>
  );
}
