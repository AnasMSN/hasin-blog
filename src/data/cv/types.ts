export interface EducationExtra {
  heading: string;
  items: string[];
}

export interface EducationEntry {
  school: string;
  degree: string;
  period: string;
  gpa: string;
  details: string[];
  extra?: EducationExtra[];
}

export interface SkillCategory {
  category: string;
  items: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ContactInfo {
  phone: string;
  email: string;
  github: string;
  githubUrl: string;
  linkedin: string;
  linkedinUrl: string;
}

export interface CVData {
  name: string;
  tagline: string;
  photo: string;
  contact: ContactInfo;
  education: EducationEntry[];
  skills: SkillCategory[];
  experience: ExperienceEntry[];
}
