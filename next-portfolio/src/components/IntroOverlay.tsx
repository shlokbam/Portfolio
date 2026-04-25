"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";

const lines = [
  "ESTABLISHING SECURE CONNECTION...",
  "ACCESSING PORTFOLIO DATABASE...",
  "DECRYPTING CASE FILES...",
  "SUBJECT IDENTIFIED: [SHLOK BAM]",
  "STATUS: ACTIVE INVESTIGATION",
];

export default function IntroOverlay() {
  const { isIntroComplete, setIsIntroComplete } = useTheme();
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isIntroComplete) return;

    if (currentLine < lines.length) {
      let i = 0;
      const text = lines[currentLine];
      setIsTyping(true);
      
      const timer = setInterval(() => {
        setDisplayText(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(timer);
          setIsTyping(false);
          setTimeout(() => {
            setCurrentLine((prev) => prev + 1);
          }, 800);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [currentLine, isIntroComplete]);

  if (isIntroComplete) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center p-4 font-mono"
    >
      <div className="w-full max-w-2xl">
        <div className="mb-8 space-y-2 opacity-50 text-xs">
          {lines.slice(0, currentLine).map((line, idx) => (
            <div key={idx} className="text-primary">{line}</div>
          ))}
        </div>
        
        <div className="h-12 flex items-center">
          <span className="text-xl md:text-2xl text-primary font-bold tracking-widest uppercase">
            {displayText}
            {isTyping && <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="inline-block w-3 h-6 bg-primary ml-1 align-middle"
            />}
          </span>
        </div>

        {currentLine >= lines.length && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsIntroComplete(true)}
            className="mt-12 px-8 py-4 border-2 border-primary text-primary font-bold tracking-widest hover:bg-primary hover:text-background transition-all duration-300 relative group overflow-hidden"
          >
            <span className="relative z-10">OPEN CASE FILE</span>
            <motion.div
              className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </motion.button>
        )}
      </div>

      {/* Glitch Overlay Effect */}
      <motion.div
        animate={{ opacity: [0, 0.05, 0] }}
        transition={{ repeat: Infinity, duration: 0.2 }}
        className="fixed inset-0 pointer-events-none bg-white z-[10001]"
      />
    </motion.div>
  );
}
