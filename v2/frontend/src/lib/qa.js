// Prepared answers for the quick-question buttons. They answer instantly, even while the API is
// asleep, and are the fallback if the live assistant can't be reached. Keep in sync with knowledge.py.
// Each: [question, answer, sources], sources being the "From:" links shown under the answer.
const src = (label, href) => ({ label, href })

export const QA = [
  ["What's his CGPA?", '9.01 CGPA through the sixth semester, B.Tech in Information Technology at Vishwakarma Institute of Technology, Pune.', [src('Journey › Learn', '/journey#ch-learn')]],
  ['Best projects?', 'His flagships are DailyDiff (agentic tech curation), ResearchOS (multi-agent research), the Enterprise Workforce Training Platform (industry-sponsored), PaisaWise (personal finance from bank SMS) and PromptVault (prompt version control).', [src('Work › DailyDiff case study', '/work/dailydiff'), src('Work', '/work')]],
  ['Patents?', 'Three as co-inventor: a YOLO wildlife-protection system (granted, CIPC South Africa), a fruit & vegetable quality classifier (filed, CIPC South Africa) and a TKPH tyre-health system (published, IPO India).', [src('Recognition › Patents', '/recognition#patents')]],
  ['Leadership?', 'Founding Chairperson of ITSA. Before that: Operations Head at Abhivriddhi, Chief Administrative at The Catalyst and Web Development Coordinator at CSI.', [src('Journey › Lead', '/journey#ch-lead'), src('Community', '/community')]],
  ['How do I reach him?', 'Email shlokbam19103@gmail.com or call +91 79746 70370 (Mon–Fri, 9am–6pm IST). He is based in Pune and open to relocation.', [src('Contact', '/contact')]]
]
