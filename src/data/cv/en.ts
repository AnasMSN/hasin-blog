import type { CVData } from './types';

const contact = {
  phone: '-',
  email: 'anas.mahasinnabih@gmail.com',
  github: 'AnasMSN',
  githubUrl: 'https://github.com/AnasMSN',
  linkedin: '/in/anas-mahasin/',
  linkedinUrl: 'https://www.linkedin.com/in/anas-mahasin/',
};

export const cv: CVData = {
  name: 'Anas Mahasin Nabih',
  tagline:
    'M.S. researcher building quantum-enhanced multimodal AI, with a backend engineering background in Go and distributed systems.',
  photo: '/images/anas.png',
  contact,
  education: [
    {
      school: 'Kyung Hee University',
      degree: 'Master of Science in Electrical Engineering',
      period: '2024 – Present',
      gpa: '4.175 / 4.3',
      details: [
        'Advanced Coursework: Deep Learning Programming, Machine Learning & Pattern Recognition, Convergence Future Communication, Convolutional Networks, Distributed Networks, and Open Source Networking.',
      ],
      extra: [
        {
          heading: 'Thesis Research',
          items: [
            'Developing a Quantum Multimodal Language Model, focusing on quantum-enhanced neural architectures for cross-modal data processing.',
          ],
        },
        {
          heading: 'Publication',
          items: [
            '2025 KICS Summer Conference — Vision Language Model for Interpreting Wigner Distribution in Quantum Optics',
          ],
        },
      ],
    },
    {
      school: 'University of Indonesia',
      degree: 'Bachelor of Computer Science',
      period: '2016 – 2020',
      gpa: '3.80 / 4.00',
      details: [
        'Key Technical Foundations: Data Structures and Algorithms, Advanced Databases, Operating Systems, Big Data Management, and Information Systems Development.',
      ],
      extra: [
        {
          heading: 'Undergraduate Thesis',
          items: [
            'Title: Development and Evaluation of a Mobile Application for Quran Memorizer Reminder',
            "User acceptance test result of developed Quran reminder application based on Charles Duhigg's habit loop.",
          ],
        },
      ],
    },
  ],
  skills: [
    {
      category: 'Artificial Intelligence & Research',
      items:
        'Quantum Machine Learning, Multimodal AI (VLM), Large Language Models (LLMs), Deep Learning, Transformer Architectures (BERT, Attention Mechanisms), Neural Networks (CNNs), Retrieval Augmented Generation (RAG).',
    },
    {
      category: 'Frameworks & Libraries',
      items: 'PyTorch, TensorFlow, NumPy, Pandas, Scikit-learn, Hugging Face Transformers.',
    },
    {
      category: 'Programming & Systems',
      items:
        'Python (Expert), Go (Golang), Data Structures & Algorithms, Distributed Systems, Clean Architecture.',
    },
    {
      category: 'Tools & Platforms',
      items: 'Git/GitHub, Linux, Docker, Cloud Platforms (AWS/GCP), API Development.',
    },
  ],
  experience: [
    {
      role: 'Backend Software Engineer',
      company: 'PT Gramedia Asri Media',
      period: '2024',
      bullets: [
        'Engineered the migration of complex library systems from Python to a high-performance Golang backend using Clean Architecture principles.',
        'Architected database migration strategies and implemented core logic for multi-platform (web/mobile) digital library applications.',
      ],
    },
    {
      role: 'Middle Software Engineer',
      company: 'PT Shippindo Teknologi Logistik',
      period: '2022 – 2023',
      bullets: [
        'Optimized distributed system performance by migrating GraphQL monorepo services to specialized microservices.',
        'Improved scheduler efficiency using Golang and resolved critical concurrency issues in legacy Cassandra database processes.',
      ],
    },
    {
      role: 'Backend Programmer',
      company: 'PT ICART GROUP INDONESIA',
      period: '2020 – 2022',
      bullets: [
        'Developed and integrated diverse payment gateways (Adyen, Xendit, DANA) into a core Ruby on Rails and Golang fintech infrastructure.',
        'Implemented automated disbursement features, focusing on transactional integrity and system reliability.',
      ],
    },
  ],
};
