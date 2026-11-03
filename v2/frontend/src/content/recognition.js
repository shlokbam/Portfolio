// The Recognition page (pages/Recognition.jsx): patents, awards and certifications.
// Paths are the originals under public/static/ (the page shows display copies of the images).
// Part of the site's content: the build publishes it in /portfolio.json.

// `ring` and `short` are the labels on the page's rotating stamp
export const PATENTS = [
  {
    office: 'CIPC · Republic of South Africa',
    date: 'Granted 25 / 02 / 2026',
    status: 'Granted',
    short: 'Granted',
    ring: 'Patent granted · CIPC ZA · 2026 · ',
    title: 'A Comprehensive Wildlife Protection System Using YOLO',
    desc: 'A multi-layered conservation and anti-poaching system that uses YOLO-based computer vision to detect human intruders, recognise animal species and dispatch automated real-time alerts.',
    appno: 'App. No. 2025/04189',
    cta: 'Register sheet',
    alt: 'Official patent register sheet',
    image: '/static/Patent/Grant_acknowledgement.png',
    document: '/static/Patent/Grant acknowledgement.pdf'
  },
  {
    office: 'CIPC · Republic of South Africa',
    date: 'Lodged 21 / 05 / 2026',
    status: 'Filed',
    short: 'Filed',
    ring: 'Patent filed · CIPC ZA · 2026 · ',
    title: 'An Intelligent Fruit and Vegetable Identification and Quality Classification System',
    desc: 'Automated agricultural quality control using digital image processing and machine learning to identify produce, evaluate freshness, detect surface defects and grade quality in real time.',
    appno: 'App. No. 2026/05473',
    cta: 'Lodging receipt',
    alt: 'Patent lodging receipt',
    image: '/static/Patent/Receipt_05473.png',
    document: '/static/Patent/Receipt 05473.pdf'
  },
  {
    office: 'IPO · Government of India',
    date: 'Published U/S 11A · 03 / 10 / 2025',
    status: 'Published',
    short: 'Published',
    ring: 'Patent published · IPO India · 2025 · ',
    title: 'Next-Generation TKPH Tire Health Management System',
    desc: 'A predictive tyre-health framework for heavy machinery that combines AI-based TKPH analytics, blockchain-secured maintenance records and digital-twin lifecycle monitoring.',
    appno: 'Indian Patent Office',
    cta: 'Application',
    alt: 'Published patent application',
    image: '/static/Patent/Patent.png',
    document: '/static/Patent/Patent.png'
  }
]

// `images`: the card's photo, and a second one shown on hover; `result`: the highlighted outcome, if any
export const AWARDS = [
  {
    org: 'INDOvateAI Sprint',
    date: 'Mar 2025',
    title: 'Best Outstanding Project · Winner',
    desc: 'Won among 200+ teams. Team pumpdotfun built IndoTrade, an AI stock assistant combining real-time data with intelligent insight, using Next.js, Flask and MySQL.',
    result: 'Winner',
    images: [['/static/certificates/images/winning_screenshots/1.jpeg', 'Team pumpdotfun receiving the award'], ['/static/certificates/images/official_posts/image.png', 'Official college post about the award']],
    links: [['Certificate', '/static/certificates/hackathons/8.pdf']]
  },
  {
    org: 'Google Cloud',
    date: '2025',
    title: 'Arcade Program · Diamond League',
    desc: "Selected into Google's hands-on cloud skills program; reached Diamond League with 90+ badges. Swag eligible, Trooper tier.",
    result: '',
    images: [['/static/Arcade/arcade_dashboard.png', 'Google Arcade progress dashboard']],
    imageTop: true,
    links: [['Dashboard', 'https://arcadecalc.netlify.app/dashboard'], ['Skills profile', 'https://www.skills.google/public_profiles/311559d8-dbf8-4586-a58f-42e5a33291f9']]
  },
  {
    org: 'Navdhara · State level',
    date: 'Sep 2024',
    title: 'Poster Competition · Top 5',
    desc: 'Team Infinity Innovators presented an AI wildlife-poaching detection system using computer vision and automated alerts.',
    result: 'Finalist',
    images: [['/static/certificates/images/official_posts/1724320631666.jpeg', 'Official Navdhara competition post']],
    links: [['Certificate', '/static/certificates/hackathons/1.pdf']]
  }
]

// the three featured certifications (`mark`: the letters on the card)
export const CERTIFICATIONS = [
  {
    org: 'McKinsey.org',
    mark: 'Mc',
    title: 'Forward Program',
    desc: 'Problem-solving, communication, adaptability and digital readiness through hands-on modules.',
    date: 'Dec 2025',
    cta: 'Certificate',
    href: '/static/certificates/certifications/Certificate.pdf'
  },
  {
    org: 'Google Cloud',
    mark: 'GCP',
    title: 'Google Cloud Data Analytics',
    desc: 'Five courses on BigQuery, data transformation, visualisation and storytelling, plus a capstone.',
    date: 'Jun 2025',
    cta: 'Credly',
    href: 'https://www.credly.com/badges/e6109deb-b3e0-414c-847c-a2a7ad21c4a6/public_url'
  },
  {
    org: 'Amazon Web Services',
    mark: 'AWS',
    title: 'AWS Cloud Practitioner Essentials',
    desc: 'Cloud fundamentals, security, pricing and architecture: EC2, S3, IAM and the Well-Architected Framework.',
    date: 'Jul 2025',
    cta: 'Certificate',
    href: '/static/certificates/certifications/aws.pdf'
  }
]

// Microsoft & LinkedIn Learning certificates (Mar 2024)
export const MORE_CERTIFICATIONS = [
  {
    title: 'Career Essentials in Data Analysis',
    desc: 'Data analysis fundamentals, visualisation and the analytical tools used in modern business.',
    href: '/static/certificates/certifications/CertificateOfCompletion_Career Essentials in Data Analysis by Microsoft and LinkedIn.pdf'
  },
  {
    title: 'Build Your Generative AI Productivity Skills',
    desc: 'Generative AI tools and techniques to automate tasks and boost productivity.',
    href: '/static/certificates/certifications/CertificateOfCompletion_Build Your Generative AI Productivity Skills with Microsoft and LinkedIn (2).pdf'
  },
  {
    title: 'Career Essentials in GitHub',
    desc: 'Version control, collaboration workflows and GitHub best practices.',
    href: '/static/certificates/certifications/CertificateOfCompletion_Career Essentials in GitHub Professional Certificate (2).pdf'
  },
  {
    title: 'Career Essentials in Project Management',
    desc: 'Project management methodologies, tools and delivery practices.',
    href: '/static/certificates/certifications/CertificateOfCompletion_Career Essentials in Project Management by Microsoft and LinkedIn (3).pdf'
  },
  {
    title: 'OpenCV for Python Developers',
    desc: 'Image processing, object detection and real-time video analysis with OpenCV.',
    href: '/static/certificates/certifications/CertificateOfCompletion_OpenCV for Python Developers.pdf'
  },
  {
    title: 'Master In-Demand Professional Soft Skills',
    desc: 'Communication, leadership, problem-solving and workplace productivity.',
    href: '/static/certificates/certifications/CertificateOfCompletion_Master InDemand Professional Soft Skills (5).pdf'
  }
]
