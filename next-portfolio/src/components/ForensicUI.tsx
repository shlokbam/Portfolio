"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";
import { 
  Activity, 
  Archive, 
  Briefcase, 
  ChevronRight, 
  FileText, 
  Fingerprint, 
  Layers, 
  Network, 
  Search, 
  User,
  Menu,
  X,
  Award,
  Shield
} from "lucide-react";

import Background3D from "./Background3D";

interface NavItem {
  id: string;
  label: string;
  icon: any;
}

const navItems: NavItem[] = [
  { id: "profile", label: "SUBJECT PROFILE", icon: User },
  { id: "stats", label: "ACTIVITY LOGS", icon: Activity },
  { id: "projects", label: "CASE FILES", icon: Archive },
  { id: "experience", label: "FIELD EXPERIENCE", icon: Shield },
  { id: "certificates", label: "VERIFIED CREDENTIALS", icon: Award },
  { id: "skills", label: "NETWORK SYSTEM", icon: Network },
  { id: "articles", label: "RESEARCH NOTES", icon: FileText },
];

export default function ForensicUI({ children }: { children: React.ReactNode }) {
  const { mode, setMode, investigationStep, setInvestigationStep, isIntroComplete, activeTab, setActiveTab } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isIntroComplete) return null;

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <Background3D />
      
      {/* Sidebar Navigation */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -240 }}
        className="fixed left-0 top-0 h-full w-64 glass-panel border-r border-primary/10 z-40 transition-all duration-500"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-primary/20 rounded-none border border-primary/40 animate-pulse">
              <Fingerprint className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-[0.2em] text-primary">FORENSIC-OS</h1>
              <p className="text-[10px] text-primary/40 font-mono">v4.0.24-STABLE</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 text-xs font-mono tracking-widest transition-all duration-300 group relative ${
                  activeTab === item.id ? "text-primary" : "text-primary/40 hover:text-primary/70"
                }`}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-full bg-primary"
                  />
                )}
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? "animate-pulse" : ""}`} />
                <span>{item.label}</span>
                {activeTab === item.id && <ChevronRight className="w-3 h-3 ml-auto animate-bounce-x" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-primary/10">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-primary/40 font-mono uppercase tracking-tighter">System Mode</label>
              <div className="flex bg-primary/5 p-1 rounded-none border border-primary/10">
                <button
                  onClick={() => setMode("browse")}
                  className={`flex-1 px-2 py-1 text-[10px] font-mono tracking-tighter transition-all ${
                    mode === "browse" ? "bg-primary text-background" : "text-primary/60 hover:text-primary"
                  }`}
                >
                  BROWSE
                </button>
                <button
                  onClick={() => setMode("investigation")}
                  className={`flex-1 px-2 py-1 text-[10px] font-mono tracking-tighter transition-all ${
                    mode === "investigation" ? "bg-primary text-background" : "text-primary/60 hover:text-primary"
                  }`}
                >
                  INVESTIGATE
                </button>
              </div>
            </div>
            <div className="text-[9px] font-mono text-primary/30 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
              DATALINK ENCRYPTED | {currentTime || "00:00:00"}
            </div>
          </div>
        </div>
        
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 glass-panel border border-primary/10 text-primary/40 hover:text-primary transition-all"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? "ml-64" : "ml-20"} p-8`}>
        <header className="mb-12 flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-[10px] text-primary/60 font-mono tracking-widest flex items-center gap-2">
              <Search size={12} /> SYSTEM / {activeTab.toUpperCase()}
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-glow italic">
              {navItems.find(n => n.id === activeTab)?.label.split(" ")[0]}
              <span className="text-primary"> {navItems.find(n => n.id === activeTab)?.label.split(" ")[1] || ""}</span>
            </h2>
          </div>

          <div className="flex gap-4">
             <div className="glass-panel p-4 border-primary/10 flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[9px] text-primary/40 font-mono uppercase">Investigation Status</p>
                   <p className="text-xs font-bold text-primary">84% COMPLETE</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
             </div>
          </div>
        </header>

        <div className="relative min-h-[calc(100vh-200px)]">
          {children}
        </div>
      </main>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
