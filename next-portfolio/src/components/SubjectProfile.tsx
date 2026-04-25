"use client";

import { motion } from "framer-motion";
import { User, MapPin, Calendar, Award, Database, Terminal, FileText } from "lucide-react";

export default function SubjectProfile() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Subject Identity Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel p-6 forensic-border relative group overflow-hidden">
          <div className="w-full aspect-square bg-primary/5 border border-primary/20 relative flex items-center justify-center overflow-hidden">
             <img src="/static/images/about/profile.png" alt="Shlok Bam" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
             <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[10px] text-primary/60 font-mono tracking-tighter">SUBJECT_ID</div>
                <div className="text-xl font-bold tracking-tighter text-glow">SHLOK BAM</div>
             </div>
             
             {/* Scanning Line */}
             <motion.div
               animate={{ top: ["0%", "100%"] }}
               transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
               className="absolute left-0 right-0 h-[2px] bg-primary/30 z-20"
             />
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-primary/40 uppercase">Designation</span>
              <span className="text-primary">DevOps & Cloud Explorer</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-primary/40 uppercase">Education</span>
              <span className="text-primary">B.Tech IT @ VIT Pune</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-primary/40 uppercase">Status</span>
              <span className="text-secondary animate-pulse">INVESTIGATION ACTIVE</span>
            </div>

            <a 
              href="/static/Resume/Shlok_Bam_VIT.pdf" 
              target="_blank"
              className="w-full py-2 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-mono text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all mt-4"
            >
              <FileText className="w-3 h-3" /> DOWNLOAD_DOSSIER
            </a>
          </div>
        </div>

        <div className="glass-panel p-6 border-primary/10">
           <h4 className="text-[10px] text-primary/40 font-mono uppercase tracking-[0.2em] mb-4">Core Metadata</h4>
           <div className="space-y-3">
              {[
                { icon: Database, label: "CGPA", value: "8.97 / 10.0" },
                { icon: Award, label: "Leadership", value: "Founding Chair @ ITSA" },
                { icon: Terminal, label: "Expertise", value: "Automation & AI" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10">
                  <item.icon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-[9px] text-primary/40 font-mono uppercase leading-none">{item.label}</p>
                    <p className="text-xs font-bold text-primary">{item.value}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Subject Analysis / About */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-panel p-8 border-primary/10 relative overflow-hidden">
          <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-[0.3em] mb-6">
            <div className="w-2 h-2 bg-primary" /> EXECUTIVE SUMMARY
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-foreground/80 leading-relaxed font-light italic">
              "Subject is a highly motivated IT student at <span className="text-primary font-normal">Vishwakarma Institute of Technology, Pune</span>, with a profound interest in <span className="text-primary font-normal">Cloud Technology, DevOps, and AI-driven automation</span>."
            </p>
            <p className="text-foreground/60 leading-relaxed mt-4">
              Demonstrated leadership as the Founding Chairperson of ITSA. Subject specializes in building efficient pipelines and solving real-world problems through innovative software solutions. Known for rapid learning and effective collaboration in technical environments.
            </p>
          </div>

          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <pre className="text-[8px] font-mono">
              {`
{
  "academic": "VIT Pune",
  "major": "Information Technology",
  "year": "2023-2027",
  "focus": ["DevOps", "AI", "Cloud"]
}
              `}
            </pre>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 border-primary/10">
            <h4 className="text-[10px] text-primary/40 font-mono uppercase tracking-[0.2em] mb-4">Operational Status</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center">
                <MapPin className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold">Pune, India</p>
                <p className="text-[10px] text-primary/40 font-mono">Current Base of Operations</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 border-primary/10">
            <h4 className="text-[10px] text-primary/40 font-mono uppercase tracking-[0.2em] mb-4">Availability</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <Calendar className="text-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold">2026-2027 ROLES</p>
                <p className="text-[10px] text-secondary/40 font-mono">Seeking Internship/SDE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
