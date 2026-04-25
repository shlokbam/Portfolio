"use client";

import { useTheme } from "@/lib/ThemeContext";
import ForensicUI from "@/components/ForensicUI";
import SubjectProfile from "@/components/SubjectProfile";
import ActivityLogs from "@/components/ActivityLogs";
import Projects from "@/components/Projects";
import FieldExperience from "@/components/FieldExperience";
import NetworkGraph from "@/components/NetworkGraph";
import ResearchNotes from "@/components/ResearchNotes";
import VerifiedDocuments from "@/components/VerifiedDocuments";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { mode, investigationStep, setInvestigationStep, activeTab } = useTheme();

  const renderSection = () => {
    switch (activeTab) {
      case "profile": return <SubjectProfile />;
      case "stats": return <ActivityLogs />;
      case "projects": return <Projects />;
      case "experience": return <FieldExperience />;
      case "certificates": return <VerifiedDocuments />;
      case "skills": return <NetworkGraph />;
      case "articles": return <ResearchNotes />;
      default: return <SubjectProfile />;
    }
  };

  return (
    <ForensicUI>
      <AnimatePresence mode="wait">
        {mode === "browse" ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="pb-24"
          >
            {renderSection()}
          </motion.div>
        ) : (
          <motion.div
            key="investigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
             <div className="max-w-2xl space-y-8">
                <div className="inline-block p-4 border border-primary/20 bg-primary/5 animate-pulse">
                  <h3 className="text-primary font-mono text-xl tracking-[0.5em]">INVESTIGATION_MODE</h3>
                </div>
                <p className="text-foreground/60 italic">
                  "System is preparing a guided investigative flow. This mode will spotlight specific evidence from the subject's career."
                </p>
                
                {/* Investigation Progress */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <motion.div 
                      key={i} 
                      animate={investigationStep === i ? { 
                        borderColor: "rgba(0, 242, 255, 1)", 
                        backgroundColor: "rgba(0, 242, 255, 0.1)",
                        scale: 1.05
                      } : { 
                        borderColor: "rgba(0, 242, 255, 0.1)",
                        scale: 1
                      }}
                      className="h-32 glass-panel border flex flex-col items-center justify-center font-mono transition-all"
                    >
                      <span className={`text-[10px] mb-1 ${investigationStep >= i ? "text-primary" : "text-primary/20"}`}>STEP_0{i}</span>
                      <div className={`w-1 h-1 rounded-full ${investigationStep >= i ? "bg-primary animate-ping" : "bg-primary/10"}`} />
                    </motion.div>
                  ))}
                </div>

                <div className="pt-8">
                  {investigationStep === 0 ? (
                    <button 
                      className="px-12 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-background transition-all font-mono font-bold tracking-widest text-sm"
                      onClick={() => setInvestigationStep(1)}
                    >
                      INITIALIZE SEQUENCE
                    </button>
                  ) : (
                    <div className="space-y-12">
                       <motion.div
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         key={investigationStep}
                         className="glass-panel p-8 forensic-border text-left"
                       >
                         <h4 className="text-primary font-mono text-xs tracking-widest mb-4">EVIDENCE_LOG_0{investigationStep}</h4>
                         {investigationStep === 1 && (
                           <div className="space-y-4">
                             <p className="text-xl font-bold">The subject founded ITSA at VIT Pune.</p>
                             <p className="text-foreground/60">This marks the beginning of their technical leadership journey, managing 50+ students.</p>
                           </div>
                         )}
                         {investigationStep === 2 && (
                           <div className="space-y-4">
                             <p className="text-xl font-bold">Developed a predictive maintenance system.</p>
                             <p className="text-foreground/60">Using machine learning to prevent machinery failure. Technical prowess confirmed.</p>
                           </div>
                         )}
                         {investigationStep === 3 && (
                           <div className="space-y-4">
                             <p className="text-xl font-bold">Architected cloud-native CI/CD pipelines.</p>
                             <p className="text-foreground/60">Confirmed mastery of AWS, Jenkins, and Terraform for mission-critical apps.</p>
                           </div>
                         )}
                       </motion.div>

                       <button 
                        className="px-8 py-3 bg-primary text-background font-mono font-bold tracking-widest text-xs hover:bg-secondary transition-colors"
                        onClick={() => setInvestigationStep((prev: number) => (prev % 3) + 1)}
                      >
                        {investigationStep < 3 ? "PROCEED TO NEXT EVIDENCE" : "RESTART ANALYSIS"}
                      </button>
                    </div>
                  )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ForensicUI>
  );
}
