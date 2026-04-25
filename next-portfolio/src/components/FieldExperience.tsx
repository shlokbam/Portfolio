"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Briefcase, Calendar, ShieldCheck } from "lucide-react";

const experiences = [
  {
    type: "EDUCATION",
    title: "Bachelor of Technology in IT",
    organization: "VIT Pune",
    date: "2023 - Present",
    details: [
      "Current Academic Standing: 8.97 CGPA",
      "Active member of Technical and Soft Skills clubs",
      "Participating in coding competitions and hackathons"
    ],
    icon: GraduationCap,
    status: "ONGOING"
  },
  {
    type: "LEADERSHIP",
    title: "Founding Chairperson",
    organization: "ITSA (IT Student Association)",
    date: "2025 - 2026",
    details: [
      "Leading and managing committee activities and events",
      "Organizing workshops and technical sessions",
      "Mentoring junior members and coordinating with faculty"
    ],
    icon: ShieldCheck,
    status: "ACTIVE"
  },
  {
    type: "LEADERSHIP",
    title: "Operations Head & Administrative Lead",
    organization: "Abhivriddhi & The Catalyst",
    date: "2024 - 2025",
    details: [
      "Operations Head - Abhivriddhi (Flagship Technical Event)",
      "Chief Administrative - The Catalyst",
      "Web Development Coordinator - Computer Society of India"
    ],
    links: [
      { label: "Operations Cert", url: "/static/certificates/clubs/Operations.jpeg" },
      { label: "Chief Admin Cert", url: "/static/certificates/clubs/Cheif.jpeg" },
      { label: "CSI Cert", url: "/static/certificates/clubs/csi.jpeg" }
    ],
    icon: Users,
    status: "COMPLETED"
  },
  {
    type: "PROFESSIONAL",
    title: "UI/UX Intern",
    organization: "Herbs Magic",
    date: "2023",
    details: [
      "Designed and implemented user interfaces for web applications",
      "Conducted user research and created wireframes",
      "Collaborated with development team for implementation"
    ],
    icon: Briefcase,
    status: "COMPLETED"
  }
];

export default function FieldExperience() {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black tracking-tighter text-glow uppercase">Service_Record</h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </div>

      <div className="space-y-6">
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 border-primary/10 flex flex-col md:flex-row gap-6 hover:border-primary/30 transition-all group"
          >
            <div className="w-16 h-16 bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
               <exp.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-2 py-1 bg-primary/10 text-primary border border-primary/20">{exp.type}</span>
                  <h3 className="text-xl font-bold tracking-tight text-glow">{exp.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-primary/60">
                   <Calendar className="w-3 h-3" /> {exp.date}
                </div>
              </div>
              
              <div className="text-sm font-bold text-primary/80">{exp.organization}</div>
              
              <ul className="space-y-1">
                {exp.details.map((detail, j) => (
                  <li key={j} className="text-xs text-foreground/60 flex items-start gap-2">
                    <span className="text-primary mt-1">»</span> {detail}
                  </li>
                ))}
              </ul>

              {exp.links && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {exp.links.map((link, k) => (
                    <a 
                      key={k} 
                      href={link.url} 
                      target="_blank" 
                      className="text-[9px] font-mono text-primary/40 hover:text-primary transition-colors flex items-center gap-1 border border-primary/10 px-2 py-1 bg-primary/5"
                    >
                      <ShieldCheck className="w-2 h-2" /> {link.label.toUpperCase()}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center">
               <div className={`px-3 py-1 text-[8px] font-mono border ${exp.status === "ACTIVE" || exp.status === "ONGOING" ? "border-secondary text-secondary" : "border-primary/20 text-primary/40"}`}>
                 {exp.status}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
