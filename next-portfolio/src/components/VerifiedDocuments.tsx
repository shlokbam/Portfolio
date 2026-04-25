"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";

const certificates = [
  {
    title: "Forward Program",
    platform: "McKinsey.org",
    date: "DEC 2025",
    description: "Professional development program focused on problem-solving, communication, and digital readiness.",
    tags: ["Leadership", "Communication", "Problem Solving"],
    link: "/static/certifications/Certificate.pdf"
  },
  {
    title: "Cloud Data Analytics",
    platform: "Google Cloud",
    date: "JUN 2025",
    description: "Comprehensive program covering cloud data analysis, BigQuery, and data storytelling.",
    tags: ["Google Cloud", "BigQuery", "Data Analytics"],
    link: "https://www.credly.com/badges/e6109deb-b3e0-414c-847c-a2a7ad21c4a6/public_url"
  },
  {
    title: "Cloud Practitioner Essentials",
    platform: "AWS",
    date: "JUL 2025",
    description: "Cloud computing concepts, security, and architecture fundamentals on Amazon Web Services.",
    tags: ["AWS", "Cloud Fundamentals"],
    link: "/static/certifications/aws.pdf"
  }
];

export default function VerifiedDocuments() {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black tracking-tighter text-glow uppercase">Verified_Credentials</h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((cert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 border-primary/10 flex gap-6 hover:border-primary/40 transition-all relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
               <ShieldCheck className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold tracking-tight text-glow">{cert.title}</h3>
                <span className="text-[9px] font-mono text-primary/40 uppercase">{cert.date}</span>
              </div>
              <p className="text-[10px] text-primary/80 font-mono uppercase tracking-widest">{cert.platform}</p>
              <p className="text-xs text-foreground/60 leading-relaxed">{cert.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {cert.tags.map((tag, j) => (
                  <span key={j} className="text-[8px] font-mono px-2 py-0.5 border border-primary/10 bg-primary/5 text-primary/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <a 
              href={cert.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute top-6 right-6 text-primary hover:text-secondary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
