"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
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
    <div style={{ perspective: 1200 }} className="mb-4 z-20">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchMove={handleMove}
        onTouchEnd={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative w-20 h-20 rounded-3xl flex items-center justify-center cursor-grab active:cursor-grabbing
          bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl 
          border border-white/60 dark:border-neutral-700/50 
          shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.03)]
          transition-colors duration-500 ${colorClass}`}
      >
        <motion.div style={{ transform: "translateZ(60px) scale(1.1)" }} className="drop-shadow-2xl pointer-events-none">
          {icon}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function Home() {
  const targetRef = useRef(null);
  const approachRef = useRef(null);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] });
  const parallaxBackdrop = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const parallaxForegroundFast = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // --- Scroll Core Approach ---
  const { scrollYProgress: approachScroll } = useScroll({
    target: approachRef,
    offset: ["start 75%", "center 50%"],
  });

  const n1Op = useTransform(approachScroll, [0.0, 0.15], [0, 1]);
  const l1Scale = useTransform(approachScroll, [0.15, 0.3], [0, 1]);
  const n2Op = useTransform(approachScroll, [0.3, 0.45], [0, 1]);
  const l2Scale = useTransform(approachScroll, [0.45, 0.6], [0, 1]);
  const n3Op = useTransform(approachScroll, [0.6, 0.75], [0, 1]);
  const l3Scale = useTransform(approachScroll, [0.75, 0.9], [0, 1]);
  const n4Op = useTransform(approachScroll, [0.9, 1.0], [0, 1]);

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      {/* PERUBAHAN UTAMA: Di mobile tingginya h-[85dvh] (dipendekkan), di desktop kembali ke min-h-[100dvh] (penuh) */}
      <section ref={targetRef} className="relative z-10 w-full h-[85dvh] md:min-h-[100dvh] md:h-auto flex items-center justify-center overflow-hidden">
        {/* TEKS "Hey there," */}
        {/* Karena section sudah pendek, top-[20%] sudah cukup untuk membuatnya dekat dengan navbar */}
        <motion.div style={{ y: parallaxBackdrop }} className="absolute top-[20%] md:top-[12%] left-1/2 -translate-x-1/2 w-full text-center z-0 pointer-events-none select-none px-2">
          <motion.h1
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[5rem] sm:text-[6rem] md:text-[10rem] lg:text-[13rem] font-serif italic tracking-tighter text-neutral-900/10 dark:text-neutral-50/10 leading-none whitespace-nowrap transition-colors duration-500"
          >
            Hey there,
          </motion.h1>
        </motion.div>

        {/* FOTO */}
        {/* Lebar kembali proporsional (w-[110%]), dan tetap menempel di dasar section (bottom-0) yang sekarang posisinya lebih tinggi */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] sm:w-[85%] md:w-[55%] lg:w-[45%] max-w-3xl z-10 flex justify-center items-end pointer-events-none">
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
          {/* TEKS "I'm Ivan" */}
          <motion.div style={{ y: parallaxForegroundFast }} className="absolute bottom-[16%] md:bottom-[15%] left-4 sm:left-6 md:left-12 pointer-events-auto z-20">
            <motion.h2
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[4.5rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[8rem] font-black sentence-case leading-[0.85] tracking-tighter text-neutral-900 dark:text-neutral-50 drop-shadow-xl transition-colors duration-500"
            >
              I'm <br /> Ivan
            </motion.h2>
          </motion.div>

          {/* TEKS "UI UX & SYSTEM ANALYST" */}
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
              <span className="text-xl sm:text-2xl md:text-4xl font-serif italic text-neutral-500 dark:text-neutral-400 -mb-1 md:-mb-3 z-10 transition-colors duration-500">Enthusiast</span>
              <h2 className="text-[1.25rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-black uppercase leading-none tracking-tighter text-neutral-900 dark:text-neutral-50 text-right drop-shadow-xl transition-colors duration-500">
                UI UX & <br /> SYSTEM ANALYST
              </h2>
            </motion.div>
          </motion.div>

          {/* TOMBOL EXPLORE */}
          <motion.div style={{ opacity: buttonOpacity }} className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto w-[90%] sm:w-auto justify-center z-30">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }} className="flex gap-4 w-full sm:w-auto">
              <a
                href="#featured"
                className="w-full sm:w-auto text-center px-8 py-4 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-lg duration-500"
              >
                Explore Work
              </a>
              <Link
                href="/about"
                className="px-8 py-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-50 text-sm font-bold rounded-full hover:bg-white dark:hover:bg-neutral-900 transition-colors hidden sm:block duration-500"
              >
                About Me
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT ME TEASER */}
      <section className="relative z-10 py-24 md:py-32 px-8 max-w-6xl mx-auto">
        <FadeIn direction="up">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">About Me</h2>
              <p className="text-neutral-500 dark:text-neutral-400 transition-colors duration-500">Beyond the pixels and code</p>
            </div>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)] group/bento">
          <FadeIn direction="up" delay={0.2} className="md:col-span-2">
            <div className="md:col-span-2 h-full bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center transition-colors duration-500 shadow-sm">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-neutral-50 tracking-tight transition-colors duration-500">Grounded in Engineering</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-10 leading-relaxed text-lg max-w-xl transition-colors duration-500">
                I contend that outstanding UI/UX necessitates a robust understanding of data structures. When I am not analyzing systems or designing in Figma, I enjoy clearing my mind by playing guitar, engaging in billiards, and tending
                to my pet turtle.
              </p>
              <div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 font-semibold text-sm px-8 py-4 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-full hover:scale-105 hover:shadow-xl transition-all duration-500"
                >
                  Get to know the person <span className="text-lg">&rarr;</span>
                </Link>
              </div>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.4} className="h-full">
            <div className="relative h-full rounded-[2rem] overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 min-h-[320px] transition-colors duration-500">
              <Image src="/images/me.jpeg" alt="Ivan's Life & Hobbies" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover/bento:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent z-10 pointer-events-none transition-colors duration-500"></div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. TOOLS & 3.5 SKILLS */}
      <section className="relative z-10 py-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 overflow-hidden flex flex-col gap-8 transition-colors duration-500">
        <FadeIn direction="up">
          <div className="text-center px-8 mb-4 flex flex-col items-center">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Software & Tools</h3>
          </div>
        </FadeIn>
        <FadeIn direction="up" delay={0.2}>
          <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div className="flex w-max" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 15 }}>
              <div className="flex w-max gap-6 pr-6">
                {toolsData.map((item, index) => (
                  <div
                    key={`block1-${index}`}
                    className="flex items-center gap-3 px-6 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-600 dark:text-neutral-400 font-medium whitespace-nowrap shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-500"
                  >
                    <span>
                      <item.icon className="w-6 h-6" />
                    </span>
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="flex w-max gap-6 pr-6">
                {toolsData.map((item, index) => (
                  <div
                    key={`block2-${index}`}
                    className="flex items-center gap-3 px-6 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-600 dark:text-neutral-400 font-medium whitespace-nowrap shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-500"
                  >
                    <span>
                      <item.icon className="w-6 h-6" />
                    </span>
                    {item.name}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </FadeIn>
      </section>

      <section className="relative z-10 pb-24 md:pb-32 pt-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Technical Skills</h3>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-4xl mx-auto">
            {skillsData.map((skill, idx) => (
              <FadeIn direction="up" delay={0.1 * idx} key={idx}>
                <motion.div initial="initial" whileInView="animate" viewport={{ once: true, margin: "-50px" }} className="py-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-lg text-neutral-700 dark:text-neutral-300 transition-colors duration-500">{skill.name}</span>
                    <motion.span variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }} transition={{ duration: 1, delay: 0.5 }} className="text-sm font-bold text-neutral-400 dark:text-neutral-500 transition-colors duration-500">
                      {skill.level}%
                    </motion.span>
                  </div>
                  <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors duration-500">
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
      {/* 4. CORE APPROACH */}
      {/* ========================================= */}
      <section ref={approachRef} className="relative z-10 py-16 md:py-24 px-8 max-w-6xl mx-auto overflow-hidden">
        <FadeIn direction="up">
          <div className="text-center mb-12 md:mb-16 relative z-20">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Core Approach</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-base transition-colors duration-500">A systematic workflow ensuring every interface is logically sound before it becomes visually stunning.</p>
          </div>
        </FadeIn>

        {/* --- DESKTOP & TABLET VIEW --- */}
        <div className="hidden sm:grid grid-cols-[180px_1fr_180px] md:grid-cols-[220px_1fr_220px] items-start max-w-4xl mx-auto">
          <motion.div style={{ opacity: n1Op }} className="flex flex-col items-center text-center">
            <TiltIconBox
              colorClass="text-orange-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
            <h3 className="text-lg font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">1. System Analysis</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs transition-colors duration-500">Deconstructing user flows, database structures, and constraints.</p>
          </motion.div>
          <div className="w-full h-full pt-10 px-0 flex items-start">
            <motion.div style={{ scaleX: l1Scale, transformOrigin: "left" }} className="w-full h-[3px] bg-neutral-900 dark:bg-neutral-50 rounded-full transition-colors duration-500" />
          </div>
          <motion.div style={{ opacity: n2Op }} className="flex flex-col items-center text-center">
            <TiltIconBox
              colorClass="text-blue-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <h3 className="text-lg font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">2. UX Research</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs transition-colors duration-500">Mapping user journeys and wireframing for frictionless navigation.</p>
          </motion.div>
          <div /> <div />
          <div className="h-10 md:h-12 w-full flex justify-center py-1">
            <motion.div style={{ scaleY: l2Scale, transformOrigin: "top" }} className="h-full w-[3px] bg-neutral-900 dark:bg-neutral-50 rounded-full transition-colors duration-500" />
          </div>
          <motion.div style={{ opacity: n4Op }} className="flex flex-col items-center text-center order-3 sm:order-0">
            <TiltIconBox
              colorClass="text-emerald-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
            />
            <h3 className="text-lg font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">4. Dev Handoff</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs transition-colors duration-500">Delivering comprehensive design systems to accelerate execution.</p>
          </motion.div>
          <div className="w-full h-full pt-10 px-0 flex items-start">
            <motion.div style={{ scaleX: l3Scale, transformOrigin: "right" }} className="w-full h-[3px] bg-neutral-900 dark:bg-neutral-50 rounded-full transition-colors duration-500" />
          </div>
          <motion.div style={{ opacity: n3Op }} className="flex flex-col items-center text-center">
            <TiltIconBox
              colorClass="text-purple-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              }
            />
            <h3 className="text-lg font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">3. UI Prototyping</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs transition-colors duration-500">Translating wireframes into interactive, high-fidelity designs.</p>
          </motion.div>
        </div>

        {/* --- MOBILE VIEW --- */}
        <div className="sm:hidden flex flex-col items-center w-full px-4 relative">
          <motion.div style={{ opacity: n1Op }} className="flex flex-col items-center text-center z-10 w-full relative bg-transparent">
            <TiltIconBox
              colorClass="text-orange-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
            <h3 className="text-lg font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">1. System Analysis</h3>
          </motion.div>

          <div className="h-10 w-full flex justify-center py-1">
            <motion.div style={{ scaleY: l1Scale, transformOrigin: "top" }} className="w-[3px] h-full bg-neutral-900 dark:bg-neutral-50 rounded-full transition-colors duration-500" />
          </div>

          <motion.div style={{ opacity: n2Op }} className="flex flex-col items-center text-center z-10 w-full relative bg-transparent">
            <TiltIconBox
              colorClass="text-blue-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <h3 className="text-lg font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">2. UX Research</h3>
          </motion.div>

          <div className="h-10 w-full flex justify-center py-1">
            <motion.div style={{ scaleY: l2Scale, transformOrigin: "top" }} className="w-[3px] h-full bg-neutral-900 dark:bg-neutral-50 rounded-full transition-colors duration-500" />
          </div>

          <motion.div style={{ opacity: n3Op }} className="flex flex-col items-center text-center z-10 w-full relative bg-transparent">
            <TiltIconBox
              colorClass="text-purple-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              }
            />
            <h3 className="text-lg font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">3. UI Prototyping</h3>
          </motion.div>

          <div className="h-10 w-full flex justify-center py-1">
            <motion.div style={{ scaleY: l3Scale, transformOrigin: "top" }} className="w-[3px] h-full bg-neutral-900 dark:bg-neutral-50 rounded-full transition-colors duration-500" />
          </div>

          <motion.div style={{ opacity: n4Op }} className="flex flex-col items-center text-center z-10 w-full relative bg-transparent">
            <TiltIconBox
              colorClass="text-emerald-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
            />
            <h3 className="text-lg font-bold mb-1 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">4. Dev Handoff</h3>
          </motion.div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 4.5. CERTIFICATIONS */}
      {/* ========================================= */}
      <section className="relative z-10 py-24 md:py-32 px-8 max-w-6xl mx-auto border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Certifications</h2>
              <p className="text-neutral-500 dark:text-neutral-400 transition-colors duration-500">Formal validations of my technical expertise.</p>
            </div>
            <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500 hidden md:block transition-colors duration-500">Click image to view details</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {certificatesData.map((cert, index) => (
            <FadeIn direction="up" delay={0.1 * index} key={cert.id}>
              <motion.div
                onClick={() => setSelectedCert(cert)}
                className="group cursor-pointer relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-500 bg-white dark:bg-neutral-900"
              >
                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500 flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100">
                  <div className="flex flex-col items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-white font-bold text-sm tracking-wide">View Credential</span>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ========================================= */}
      {/* 5. FEATURED WORK */}
      {/* ========================================= */}
      <section id="featured" className="relative z-10 py-24 md:py-32 px-8 max-w-6xl mx-auto border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500">
        <FadeIn direction="up">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">Featured Work</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-base transition-colors duration-500">Selected works highlighting problem-solving and functional design.</p>
            </div>
            <Link href="/case-studies" className="hidden md:block text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-500">
              See all case studies &rarr;
            </Link>
          </div>
        </FadeIn>

        <div className="space-y-12">
          {Object.entries(caseStudiesDB).map(([slug, project], index) => {
            const isReverseLayout = index % 2 !== 0;
            return (
              <FadeIn direction="up" key={slug} delay={0.1}>
                <div className="group w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-8 md:p-12 hover:shadow-xl dark:hover:shadow-neutral-900/50 transition-all duration-500">
                  <div className={`flex flex-col ${isReverseLayout ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-center`}>
                    <div className="flex-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2 block transition-colors duration-500">{project.role}</span>
                      <h3 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-50 transition-colors duration-500">{project.title.split(" - ")[0]}</h3>
                      <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed text-lg transition-colors duration-500">{project.outcome}</p>
                      <Link
                        href={`/case-studies/${slug}`}
                        className="inline-block font-semibold text-sm px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-500"
                      >
                        Read case study &rarr;
                      </Link>
                    </div>
                    <div className="w-full md:w-1/2 aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden relative group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors duration-500">
                      <Image src={project.images[0]} alt={`Cover image for ${project.title}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none duration-500"></div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ========================================= */}
      {/* 6. MODAL OVERLAY (MENGGUNAKAN REACT PORTAL) */}
      {/* ========================================= */}
      {mounted && createPortal(modalOverlay, document.body)}
    </main>
  );
}
