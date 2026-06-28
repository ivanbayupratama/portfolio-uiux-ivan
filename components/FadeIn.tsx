"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function FadeIn({ children, delay = 0, className = "", direction = "up" }: FadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 60, x: 0 }; // bawah, naik ke atas
      case "down":
        return { y: -60, x: 0 }; // atas, turun ke bawah
      case "left":
        return { x: -60, y: 0 }; // dari kiri, geser ke kanan
      case "right":
        return { x: 60, y: 0 }; //  kanan, geser ke kiri
      case "none":
        return { x: 0, y: 0 }; // hanya fade-in
      default:
        return { y: 60, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
