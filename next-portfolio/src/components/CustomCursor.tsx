"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const cursorX = useSpring(0, { damping: 20, stiffness: 300 });
  const cursorY = useSpring(0, { damping: 20, stiffness: 300 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      // Optimize: Only check for specific interactable elements instead of expensive getComputedStyle
      const isInteractable = target.closest("a, button, [role='button'], input, select, textarea");
      setIsPointer(!!isInteractable);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Outer Crosshair */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-primary/30 rounded-none pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: isPointer ? 45 : 0,
          scale: isPointer ? 1.5 : 1,
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary/50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary/50" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-primary/50" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-primary/50" />
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Glow */}
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}

