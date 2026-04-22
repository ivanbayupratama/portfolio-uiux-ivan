"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = ["Hello, I'm Ivan", "I'm a Designer who analyzes", "Bridging logic and UI", "Crafting intuitive experiences", "Designing with purpose"];

export default function TypewriterEffect() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[index];

    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseTime = 2500;

    let timer: NodeJS.Timeout;

    if (!isDeleting && text === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % phrases.length);
    } else {
      const nextText = isDeleting ? currentPhrase.substring(0, text.length - 1) : currentPhrase.substring(0, text.length + 1);

      timer = setTimeout(() => setText(nextText), isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, index]);

  return (
    <div className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight min-h-30 md:min-h-40">
      <span className="text-neutral-900 dark:text-neutral-50">{text}</span>
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} className="inline-block w-1 h-[0.9em] bg-neutral-900 dark:bg-neutral-50 ml-2 translate-y-1 md:translate-y-1.5" />
    </div>
  );
}
