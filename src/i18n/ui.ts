export const defaultLang = 'en';

export const languages = {
  en: 'English',
  ko: '한국어',
  id: 'Bahasa Indonesia',
} as const;

export const ui = {
  en: {
    'site.title': 'Anas Mahasin Nabih',
    'nav.home': 'Home',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.language': 'Language',
    'home.section.education': 'Education',
    'home.section.skills': 'Technical Skills',
    'home.section.experience': 'Research & Engineering Experience',
    'home.contact.phone': 'Phone',
    'home.contact.email': 'Email',
    'portfolio.title': 'Portfolio',
    'blog.title': 'Blog',
    'blog.comingSoon': 'The blog is being migrated here — in the meantime, thanks for your patience.',
  },
  ko: {
    'site.title': 'Anas Mahasin Nabih',
    'nav.home': '홈',
    'nav.portfolio': '포트폴리오',
    'nav.blog': '블로그',
    'nav.language': '언어',
    'home.section.education': '학력 사항',
    'home.section.skills': '기술 스택',
    'home.section.experience': '연구 및 엔지니어링 경험',
    'home.contact.phone': '전화번호',
    'home.contact.email': '이메일',
    'portfolio.title': '포트폴리오',
    'blog.title': '블로그',
    'blog.comingSoon': '블로그를 이곳으로 이전하는 중입니다. 조금만 기다려 주세요.',
  },
  id: {
    'site.title': 'Anas Mahasin Nabih',
    'nav.home': 'Beranda',
    'nav.portfolio': 'Portofolio',
    'nav.blog': 'Blog',
    'nav.language': 'Bahasa',
    'home.section.education': 'Pendidikan',
    'home.section.skills': 'Keahlian Teknis',
    'home.section.experience': 'Pengalaman Riset & Rekayasa',
    'home.contact.phone': 'Telepon',
    'home.contact.email': 'Email',
    'portfolio.title': 'Portofolio',
    'blog.title': 'Blog',
    'blog.comingSoon': 'Blog sedang dipindahkan ke sini — mohon tunggu sebentar.',
  },
} as const;

export type Lang = keyof typeof ui;
export type UiKey = keyof (typeof ui)[typeof defaultLang];
