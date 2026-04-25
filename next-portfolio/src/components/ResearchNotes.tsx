"use client";

import { motion } from "framer-motion";
import { FileText, ExternalLink, Calendar, BookOpen } from "lucide-react";

const articles = [
  {
    title: "I Built a Full DevOps CI/CD Pipeline from Scratch — Here's Everything That Went Wrong",
    description: "A deep dive into the challenges of setting up a production-ready Jenkins/Docker pipeline on AWS, and the lessons learned from failure.",
    date: "MAR 2026",
    readTime: "8 min read",
    link: "https://shlokbam.hashnode.dev/i-built-a-full-devops-ci-cd-pipeline-from-scratch-here-s-everything-that-went-wrong",
    platform: "HASHNODE",
    tags: ["DEVOPS", "AWS", "CI/CD"]
  }
];

export default function ResearchNotes() {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black tracking-tighter text-glow uppercase">Classified_Intelligence</h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 border-primary/10 group hover:border-primary/40 transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-primary/5 border border-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="text-[10px] font-mono text-primary/40 px-2 py-1 border border-primary/10">
                SOURCE: {article.platform}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
              {article.title}
            </h3>
            
            <p className="text-sm text-foreground/60 mb-8 flex-1">
              {article.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag, j) => (
                <span key={j} className="text-[8px] font-mono px-2 py-0.5 bg-primary/5 border border-primary/10 text-primary/60 uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-primary/10">
              <div className="flex items-center gap-4 text-[10px] font-mono text-primary/40">
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</div>
                <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {article.readTime}</div>
              </div>
              
              <a 
                href={article.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] font-mono text-primary hover:text-secondary transition-colors"
              >
                ACCESS_NOTE <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
