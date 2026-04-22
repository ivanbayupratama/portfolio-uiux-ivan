"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  // TAMBAHAN: Parameter arah animasi
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function FadeIn({ children, delay = 0, className = "", direction = "up" }: FadeInProps) {
  // Fungsi logika untuk menentukan posisi awal berdasarkan arah
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 60, x: 0 }; // Muncul dari bawah, naik ke atas
      case "down":
        return { y: -60, x: 0 }; // Muncul dari atas, turun ke bawah
      case "left":
        return { x: -60, y: 0 }; // Muncul dari kiri, geser ke kanan
      case "right":
        return { x: 60, y: 0 }; // Muncul dari kanan, geser ke kiri
      case "none":
        return { x: 0, y: 0 }; // Hanya fade-in tanpa pergerakan
      default:
        return { y: 60, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }} // Hasil akhir selalu kembali ke titik 0 (posisi asli)
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
