"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { LucideIcon, Search, Shield, Zap, ExternalLink, Archive } from "lucide-react";

interface CaseFileCardProps {
  title: string;
  incident: string;
  investigation: string;
  evidence: string[];
  resolution: string;
  link: string;
  type: string;
}

export default function CaseFileCard({ 
  title, 
  incident, 
  investigation, 
  evidence, 
  resolution, 
  link, 
  type 
}: CaseFileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isExpanded) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const toggleExpand = () => {
    if (!isExpanded) {
      gsap.to(cardRef.current, {
        zIndex: 50,
        duration: 0.5,
        ease: "power3.inOut"
      });
    } else {
      gsap.to(cardRef.current, {
        zIndex: 1,
        duration: 0.5,
        delay: 0.3
      });
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleExpand}
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-40"
        />
      )}

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleExpand}
        style={{
          rotateX: isExpanded ? 0 : rotateX,
          rotateY: isExpanded ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={isExpanded ? {
          position: "fixed",
          top: "10%",
          left: "10%",
          width: "80%",
          height: "80%",
          x: 0,
          y: 0,
          scale: 1,
        } : {
          position: "relative",
          top: 0,
          left: 0,
          width: "100%",
          height: "320px",
          scale: 1,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className={`group cursor-pointer glass-panel p-6 rounded-none forensic-border overflow-hidden ${
          isExpanded ? "z-50" : "z-10 hover:border-primary/50"
        }`}
      >
        <div className={`relative h-full flex flex-col ${isExpanded ? "md:flex-row gap-8 overflow-y-auto" : ""}`}>
          
          <div className={`${isExpanded ? "md:w-1/3" : "w-full flex flex-col h-full"}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 border border-primary/20">
                <Archive className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-glow leading-tight">{title}</h3>
                <p className="text-[10px] text-primary/60 font-mono mt-1 tracking-widest">{type}</p>
              </div>
            </div>

            {!isExpanded ? (
              <div className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-2">
                  {evidence.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[8px] px-2 py-0.5 bg-primary/5 border border-primary/10 text-primary/70 uppercase font-mono">
                      {tag}
                    </span>
                  ))}
                  {evidence.length > 3 && (
                    <span className="text-[8px] px-2 py-0.5 text-primary/40 font-mono">+{evidence.length - 3} MORE</span>
                  )}
                </div>
                <div className="text-[9px] text-primary/40 font-mono flex items-center gap-2 border-t border-primary/5 pt-3">
                  <Search className="w-3 h-3" />
                  CLICK_TO_INVESTIGATE
                </div>
              </div>
            ) : (
              <div className="mt-auto pt-6 border-t border-primary/10">
                 <a 
                   href={link} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   onClick={(e) => e.stopPropagation()}
                   className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-background font-mono text-xs font-bold tracking-widest hover:bg-secondary transition-colors"
                 >
                   <ExternalLink size={14} /> ACCESS_REPOSITORY
                 </a>
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <section>
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs tracking-widest uppercase">
                  <Shield className="w-4 h-4" /> Incident_Report
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed font-light italic">"{incident}"</p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs tracking-widest uppercase">
                  <Search className="w-4 h-4" /> Investigative_Findings
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{investigation}</p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs tracking-widest uppercase">
                  <Zap className="w-4 h-4" /> Collected_Evidence
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {evidence.map((item, i) => (
                    <div key={i} className="p-2 bg-primary/5 border border-primary/10 text-[10px] font-mono text-primary/80 flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary/40 rounded-full" /> {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-4 bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2 text-secondary font-bold text-xs tracking-widest uppercase">
                   Final_Resolution
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed font-bold">{resolution}</p>
              </section>
            </div>
          )}

          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/20 pointer-events-none" />
          
          <motion.div
            animate={{ top: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-primary/10 pointer-events-none"
          />
        </div>
      </motion.div>
    </>
  );
}
