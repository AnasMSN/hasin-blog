import type { CVData } from './types';

// Sourced directly from the Korean CV provided by the user (2026-08-03).
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
    '양자 강화 멀티모달 AI를 연구하는 석사 과정 연구원이며, Go와 분산 시스템 백엔드 엔지니어링 경험을 보유하고 있습니다.',
  photo: '/images/anas.png',
  contact,
  education: [
    {
      school: '경희대학교',
      degree: '전기전자공학 석사',
      period: '2024 - 현재',
      gpa: '4.21 / 4.3',
      details: [
        '심화 수강 과목: 딥러닝 프로그래밍, 머신러닝 및 패턴 인식, 융합 미래 통신, 합성곱 신경망 (Convolutional Networks), 분산 네트워크 (Distributed Networks), 오픈 소스 네트워킹 (Open Source Networking).',
      ],
      extra: [
        {
          heading: '학위 논문 연구',
          items: [
            '크로스 모달 데이터 처리를 위한 양자 강화 신경망 아키텍처에 중점을 둔 양자 멀티모달 언어 모델 (Quantum Multimodal Language Model) 개발.',
          ],
        },
        {
          heading: '학술 출판',
          items: [
            '2025 한국통신학회 (KICS) 하계 학술대회 — 양자 광학에서 위그너 분포 해석을 위한 시각-언어 모델 (Vision Language Model for Interpreting Wigner Distribution in Quantum Optics)',
            '크로스 모달 데이터 처리를 위한 양자 멀티모달 언어 모델 (Quantum Multimodal Models for Cross-Domain Quantum Computing) 개발.',
          ],
        },
      ],
    },
    {
      school: 'Universitas Indonesia',
      degree: '컴퓨터 공학 학사',
      period: '2016 - 2020',
      gpa: '3.80 / 4.00',
      details: [
        '주요 기술 기초: 자료구조 및 알고리즘 (Data Structures and Algorithms), 고급 데이터베이스, 운영체제, 빅데이터 관리, 정보 시스템 개발.',
      ],
      extra: [
        {
          heading: '학부 논문',
          items: [
            '학사 졸업 논문: 꾸란 암기 알림을 위한 모바일 애플리케이션 개발 및 평가 (Development and Evaluation of a Mobile Application for Quran Memorizer Reminder).',
            '찰스 두히그 (Charles Duhigg)의 습관 고리 (Habit Loop)를 기반으로 개발된 꾸란 알림 애플리케이션의 사용자 수용 테스트 결과.',
          ],
        },
      ],
    },
  ],
  skills: [
    {
      category: '인공지능 및 연구',
      items:
        '양자 머신러닝 (Quantum Machine Learning), 멀티모달 인공지능 (VLM), 대형 언어 모델 (LLMs), 딥러닝 (Deep Learning), 트랜스포머 아키텍처 (Transformer Architectures) (버트 (BERT), 어텐션 메커니즘 (Attention Mechanisms)), 신경망 (Neural Networks) (씨엔엔 (CNNs)), 검색 증강 생성 (RAG).',
    },
    {
      category: '프레임워크 및 라이브러리',
      items:
        '파이토치 (PyTorch), 텐서플로우 (TensorFlow), 넘파이 (NumPy), 판다스 (Pandas), 사이킷런 (Scikit-learn), 허깅페이스 트랜스포머 (Hugging Face Transformers).',
    },
    {
      category: '프로그래밍 및 시스템',
      items:
        '파이썬 (Python) (Expert), 고 언어 (Go/Golang), 자료구조 및 알고리즘 (Data Structures & Algorithms), 분산 시스템 (Distributed Systems), 클린 아키텍처 (Clean Architecture).',
    },
    {
      category: '도구 및 플랫폼',
      items:
        '깃/깃허브 (Git/GitHub), 리눅스 (Linux), 도커 (Docker), 클라우드 플랫폼 (Cloud Platforms) (에이더블유에스/지씨피 (AWS/GCP)), 에이피아이 (API) 개발.',
    },
  ],
  experience: [
    {
      role: '백엔드 소프트웨어 엔지니어',
      company: 'PT Gramedia Asri Media',
      period: '2024',
      bullets: [
        '클린 아키텍처 (Clean Architecture) 원칙을 적용하여 복잡한 도서관 시스템을 파이썬 (Python)에서 고성능 고 언어 (Golang) 백엔드로 마이그레이션함.',
        '데이터베이스 마이그레이션 전략을 설계하고 다중 플랫폼 (웹/모바일) 디지털 도서관 애플리케이션을 위한 핵심 로직을 구현함.',
      ],
    },
    {
      role: '미들 소프트웨어 엔지니어',
      company: 'PT Shippindo Teknologi Logistik',
      period: '2022 – 2023',
      bullets: [
        '그래프큐엘 모노레포 (GraphQL monorepo) 서비스를 특화된 마이크로서비스로 마이그레이션하여 분산 시스템 성능을 최적화함.',
        '고 언어 (Golang)를 사용하여 스케줄러 효율성을 향상시키고 레거시 카산드라 (Cassandra) 데이터베이스 프로세스에서 발생한 치명적인 동시성 (Concurrency) 문제를 해결함.',
      ],
    },
    {
      role: '백엔드 프로그래머',
      company: 'PT ICART GROUP INDONESIA',
      period: '2020 – 2022',
      bullets: [
        '다양한 결제 게이트웨이 (Adyen, Xendit, DANA)를 핵심 루비 온 레일즈 (Ruby on Rails) 및 고 언어 (Golang) 핀테크 인프라에 개발 및 통합함.',
        '트랜잭션 무결성과 시스템 안정성에 중점을 두고 자동화된 지출 (Disbursement) 기능을 구현함.',
      ],
    },
  ],
};
