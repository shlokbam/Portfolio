// The Journey page (pages/Journey.jsx): work, leadership and education, newest first in each chapter.
// `certificates`: original image paths under public/static/ (the page shows their display copies).
// `logo` (public/static/logos/) or `mono` (letters, when there is no logo) is the organisation's mark;
// `href` its official page. Part of the site's content: the build publishes it in /portfolio.json.
const VIT_SCCG = 'https://www.vit.edu/sccg/' // VIT's page for Abhivriddhi (the club's own site is down)

export const JOURNEY = [
  {
    id: 'ch-work',
    n: '01',
    word: 'Work',
    label: 'Industry',
    items: [
      {
        when: '2026 → Now',
        kind: 'Internship',
        role: 'Intern',
        org: 'PharmaACE Innovations',
        points: [
          'Engineered an NPI matching pilot (Python, Streamlit, Snowpark, rapidfuzz) for a Fortune 500 pharma client that auto-accepted 94% (163 of 174) of a real test batch and routed 11 records for review.',
          'Developed a News Monitor pilot (Python, FastAPI, React, Playwright) tracking 1,200+ pharma newsrooms every 30 minutes, with a no-LLM scan and a GPT-4o-mini source-validation judge.',
          'Building a Forecast Reporting Agent (Python, FastAPI, LLMs) that turns natural-language questions into SQL with execution-based validation, LLM self-correction and chart recommendations.'
        ],
        logo: '/static/logos/pharmaace.svg',
        href: 'https://www.pharmaace.com/'
      },
      {
        when: '2024',
        kind: 'Offer',
        role: 'Data Annotation Intern',
        org: 'Qualitas Global',
        points: [
          'Selected for the role in second year, first semester.',
          'Could not proceed because of the academic schedule.'
        ],
        logo: '/static/logos/qualitas-global.svg',
        href: 'https://www.qualitasglobal.com/'
      },
      {
        when: '2023',
        kind: 'Internship',
        role: 'UI/UX Intern',
        org: 'Herbs Magic',
        points: [
          'Designed and implemented user interfaces for web applications.',
          'Conducted user research and created wireframes.',
          'Collaborated with the development team through implementation.'
        ],
        mono: 'HM'
      }
    ]
  },
  {
    id: 'ch-lead',
    n: '02',
    word: 'Lead',
    label: 'Leadership',
    items: [
      {
        when: '2025-26',
        kind: 'Founding chair',
        role: 'Chairperson',
        org: 'Information Technology Students\' Association (ITSA), VIT Pune',
        points: [
          'Led a 50+ member student team from July 2025 to June 2026.',
          'Organised a department-wide AI workshop (500+ attendees), mock GD/PIs and an INR 1 lakh-budget event.',
          'Built a QR attendance system used at an event with 750+ attendees.'
        ],
        certificates: ['/static/certificates/clubs/ITSA.png'],
        logo: '/static/logos/itsa.webp'
      },
      {
        when: '2024-25',
        kind: 'Operations',
        role: 'Operations Head',
        org: 'Abhivriddhi',
        points: ['Ran operations for the club and anchored its flagship technical event, EDGE’24.'],
        certificates: ['/static/certificates/clubs/Operations.jpeg'],
        logo: '/static/logos/abhivriddhi.webp',
        href: VIT_SCCG
      },
      {
        when: '2024-25',
        kind: 'Administration',
        role: 'Chief Administrative',
        org: 'The Catalyst',
        points: ['Led administration and logistics for the club.'],
        certificates: ['/static/certificates/clubs/Cheif.jpeg'],
        mono: 'TC'
      },
      {
        when: '2024-25',
        kind: 'Web',
        role: 'Web Development Coordinator',
        org: 'Computer Society of India',
        points: ['Coordinated web development for the chapter.'],
        certificates: ['/static/certificates/clubs/csi.jpeg'],
        logo: '/static/logos/csi.webp',
        href: 'https://vit.edu/wp-content/uploads/2024/07/About-CSI-CSI-Student-Chapter-VIT-Pune.pdf'
      },
      {
        when: '2023-24',
        kind: 'Technical',
        role: 'Technical Coordinator',
        org: 'Abhivriddhi',
        points: ['Technical and content roles for club events.'],
        certificates: ['/static/certificates/clubs/Technical.jpeg'],
        logo: '/static/logos/abhivriddhi.webp',
        href: VIT_SCCG
      }
    ]
  },
  {
    id: 'ch-learn',
    n: '03',
    word: 'Learn',
    label: 'Education',
    items: [
      {
        when: '2023 → Now',
        kind: 'Undergraduate',
        role: 'B.Tech, Information Technology',
        org: 'Vishwakarma Institute of Technology, Pune',
        points: [
          '9.01 / 10 CGPA, graduating May 2027.',
          'Active member of multiple technical and soft-skills clubs.',
          'Taking part in coding competitions and hackathons.'
        ],
        logo: '/static/logos/vit-pune.webp',
        href: 'https://www.vit.edu/'
      },
      {
        when: '2010-23',
        kind: 'School',
        role: 'Primary & Secondary Education',
        org: 'Grades 1–12',
        points: [
          'Class 10 completed in 2021.',
          'Class 12 completed in 2023.',
          'Developed the interest in technology and programming that led here.'
        ],
        mono: '12'
      }
    ]
  }
]
