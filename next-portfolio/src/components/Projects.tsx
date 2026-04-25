"use client";

import { motion } from "framer-motion";
import CaseFileCard from "./CaseFileCard";

const projects = [
  {
    title: "CI/CD Pipeline for Flask App",
    incident: "Manual deployment bottleneck in Flask-based task management systems.",
    investigation: "Architected a full DevOps pipeline using Jenkins, Docker, and Terraform on AWS EC2.",
    evidence: ["Flask", "Docker", "Jenkins", "Terraform", "AWS", "MySQL"],
    resolution: "Automated end-to-end delivery with GitHub webhooks, reducing deployment time by 90%.",
    link: "https://github.com/shlokbam/flask-todo-app",
    type: "DEVOPS",
  },
  {
    title: "Smart TKPH Monitoring System",
    incident: "Unpredicted heavy machinery tire failure causing operational downtime.",
    investigation: "Developed a real-time monitoring system with predictive maintenance using ML analytics.",
    evidence: ["Python", "Flask", "Firebase", "Scikit-Learn"],
    resolution: "Achieved 94.2% accuracy in predicting failure events, preventing costly machine downtime.",
    link: "https://github.com/shlokbam/Real-Time-Smart-TKPH-Monitoring-and-Predictive-Maintenance-System-for-Heavy-Machinery",
    type: "AI/ML",
  },
  {
    title: "FormMate AI",
    incident: "Inefficiency in repetitive data entry for web forms.",
    investigation: "Created a Chrome extension that leverages a personal knowledge base to auto-fill forms.",
    evidence: ["Flask", "Firebase", "Chrome API", "Natural Language Processing"],
    resolution: "Streamlined data entry processes with smart field matching and secure auth.",
    link: "https://github.com/shlokbam/FormMate_AI",
    type: "PRODUCTIVITY",
  },
  {
    title: "IndoTrade (Indovate)",
    incident: "Fragmented financial data making informed trading decisions difficult.",
    investigation: "Built an AI-powered stock assistant combining real-time data with intelligent insights.",
    evidence: ["Next.js", "Flask", "Gemini AI", "MySQL"],
    resolution: "Won Outstanding Performance Award at IndoVateAI Sprint 2025.",
    link: "https://github.com/shlokbam/indovate",
    type: "FINTECH",
  },
  {
    title: "AutoVault",
    incident: "Security risks in long-term cloud file storage and access.",
    investigation: "Implemented time-limited file access with automated expiry using serverless AWS.",
    evidence: ["AWS Lambda", "S3", "RDS", "SES", "EventBridge"],
    resolution: "Secured file sharing with intelligent cleanup and automated expiry notifications.",
    link: "https://github.com/shlokbam/AutoVault",
    type: "CLOUD",
  },
];

export default function Projects() {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black tracking-tighter text-glow uppercase">Classified_Projects</h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <CaseFileCard key={i} {...project} />
        ))}
      </div>
    </div>
  );
}
