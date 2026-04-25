"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Zap, Code, Terminal, Activity, PieChart } from "lucide-react";

export default function ActivityLogs() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "LEETCODE_SOLVED", value: "350+", color: "text-primary", icon: Terminal, link: "https://leetcode.com/u/shlokbam05/" },
    { label: "CODEFORCES_RATING", value: "1100+", color: "text-primary", icon: Zap, link: "https://codeforces.com/profile/shlokbam" },
    { label: "CODECHEF_STARS", value: "2★", color: "text-primary", icon: Code, link: "https://www.codechef.com/users/shlokbam" },
    { label: "PROJECTS_COMMITTED", value: "15+", color: "text-primary", icon: BarChart3, link: "https://github.com/shlokbam" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <a 
            key={i} 
            href={stat.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass-panel p-6 border-primary/10 hover:border-primary/30 transition-colors group relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-mono text-primary/40 uppercase mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold font-mono text-primary text-glow">{stat.value}</span>
                <stat.icon className="w-4 h-4 mb-1 text-primary/20 group-hover:text-primary transition-colors" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 p-1 opacity-5 group-hover:opacity-20 transition-opacity">
               <stat.icon className="w-12 h-12" />
            </div>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Network Activity Graph */}
        <div className="glass-panel p-6 border-primary/10">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-mono text-primary/60 uppercase tracking-widest flex items-center gap-2">
               <Activity className="w-4 h-4" /> NETWORK_PULSE
            </h4>
            <div className="text-[10px] font-mono text-secondary animate-pulse">CONNECTION_STABLE</div>
          </div>
          
          <div className="h-48 flex items-end gap-1 px-2">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${Math.random() * 80 + 20}%` }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: Math.random() * 2 + 1 }}
                className="flex-1 bg-primary/20 min-w-[2px] border-t border-primary/40"
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[8px] font-mono text-primary/30">
            <span>00:00:00</span>
            <span>DATA_STREAM_SYNCHRONIZED</span>
            <span>{currentTime || "00:00:00"}</span>
          </div>
        </div>

        {/* Compute Distribution */}
        <div className="glass-panel p-6 border-primary/10 flex flex-col justify-between">
           <h4 className="text-xs font-mono text-primary/60 uppercase tracking-widest flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4" /> COMPUTE_DISTRIBUTION
           </h4>
           
           <div className="space-y-6">
              {[
                { label: "Automation / DevOps", pct: 45, color: "#00f2ff" },
                { label: "AI / Machine Learning", pct: 30, color: "#00ffaa" },
                { label: "Full Stack Dev", pct: 25, color: "#ffffff" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-primary/70">{item.label}</span>
                    <span className="text-primary">{item.pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
           </div>

           <div className="mt-8 p-3 bg-primary/5 border-l-2 border-primary/30 font-mono text-[9px] text-primary/40">
             &gt; CPU_CYCLES_OPTIMIZED_FOR_HEAVY_LOAD<br />
             &gt; MEMORY_ALLOCATION_BALANCED
           </div>
        </div>
      </div>
    </div>
  );
}
