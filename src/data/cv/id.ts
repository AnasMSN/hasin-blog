import type { CVData } from './types';

// NOTE: No Indonesian CV was provided by the user (only English and Korean were).
// This is a first-pass translation of the English CV done for scaffolding purposes —
// please review/correct before treating it as final, especially section headings and
// any domain-specific phrasing.
const contact = {
  phone: '+62 813 1524 7621',
  email: 'anas.mahasinnabih@gmail.com',
  github: 'AnasMSN',
  githubUrl: 'https://github.com/AnasMSN',
  linkedin: '/in/anas-mahasin/',
  linkedinUrl: 'https://www.linkedin.com/in/anas-mahasin/',
};

export const cv: CVData = {
  name: 'Anas Mahasin Nabih',
  tagline:
    'Peneliti magister yang mengembangkan AI multimodal berbasis quantum, dengan latar belakang rekayasa backend di Go dan sistem terdistribusi.',
  photo: '/images/anas.png',
  contact,
  education: [
    {
      school: 'Kyung Hee University',
      degree: 'Magister Teknik Elektro',
      period: '2024 – Sekarang',
      gpa: '4.175 / 4.3',
      details: [
        'Mata Kuliah Lanjutan: Deep Learning Programming, Machine Learning & Pattern Recognition, Convergence Future Communication, Convolutional Networks, Distributed Networks, dan Open Source Networking.',
      ],
      extra: [
        {
          heading: 'Riset Tesis',
          items: [
            'Mengembangkan Quantum Multimodal Language Model, dengan fokus pada arsitektur neural network berbasis quantum untuk pemrosesan data lintas modalitas (cross-modal).',
          ],
        },
        {
          heading: 'Publikasi',
          items: [
            '2025 KICS Summer Conference — Vision Language Model for Interpreting Wigner Distribution in Quantum Optics',
          ],
        },
      ],
    },
    {
      school: 'Universitas Indonesia',
      degree: 'Sarjana Ilmu Komputer',
      period: '2016 – 2020',
      gpa: '3.80 / 4.00',
      details: [
        'Dasar Teknis Utama: Struktur Data dan Algoritma, Basis Data Lanjutan, Sistem Operasi, Manajemen Big Data, dan Pengembangan Sistem Informasi.',
      ],
      extra: [
        {
          heading: 'Skripsi',
          items: [
            'Judul: Pengembangan dan Evaluasi Aplikasi Mobile Pengingat Hafalan Al-Quran (Quran Memorizer Reminder).',
            'Hasil uji penerimaan pengguna (user acceptance test) dari aplikasi pengingat Al-Quran yang dikembangkan berdasarkan habit loop milik Charles Duhigg.',
          ],
        },
      ],
    },
  ],
  skills: [
    {
      category: 'Kecerdasan Buatan & Riset',
      items:
        'Quantum Machine Learning, Multimodal AI (VLM), Large Language Models (LLMs), Deep Learning, Transformer Architectures (BERT, Attention Mechanisms), Neural Networks (CNNs), Retrieval Augmented Generation (RAG).',
    },
    {
      category: 'Framework & Library',
      items: 'PyTorch, TensorFlow, NumPy, Pandas, Scikit-learn, Hugging Face Transformers.',
    },
    {
      category: 'Pemrograman & Sistem',
      items:
        'Python (Expert), Go (Golang), Struktur Data & Algoritma, Sistem Terdistribusi, Clean Architecture.',
    },
    {
      category: 'Tools & Platform',
      items: 'Git/GitHub, Linux, Docker, Cloud Platform (AWS/GCP), Pengembangan API.',
    },
  ],
  experience: [
    {
      role: 'Backend Software Engineer',
      company: 'PT Gramedia Asri Media',
      period: '2024',
      bullets: [
        'Mengerjakan migrasi sistem perpustakaan yang kompleks dari Python ke backend Golang berperforma tinggi menggunakan prinsip Clean Architecture.',
        'Merancang strategi migrasi database dan mengimplementasikan logika inti untuk aplikasi perpustakaan digital multi-platform (web/mobile).',
      ],
    },
    {
      role: 'Middle Software Engineer',
      company: 'PT Shippindo Teknologi Logistik',
      period: '2022 – 2023',
      bullets: [
        'Mengoptimalkan performa sistem terdistribusi dengan memigrasikan layanan GraphQL monorepo menjadi microservices khusus.',
        'Meningkatkan efisiensi scheduler menggunakan Golang dan menyelesaikan masalah concurrency kritis pada proses database Cassandra lama (legacy).',
      ],
    },
    {
      role: 'Backend Programmer',
      company: 'PT ICART GROUP INDONESIA',
      period: '2020 – 2022',
      bullets: [
        'Mengembangkan dan mengintegrasikan berbagai payment gateway (Adyen, Xendit, DANA) ke infrastruktur fintech inti berbasis Ruby on Rails dan Golang.',
        'Mengimplementasikan fitur disbursement otomatis, dengan fokus pada integritas transaksi dan keandalan sistem.',
      ],
    },
  ],
};
