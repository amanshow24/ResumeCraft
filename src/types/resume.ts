export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other';
  level: 1 | 2 | 3 | 4 | 5;
}

export interface Achievement {
  id: string;
  title: string;
  organization?: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'grid';
  items?: string[];
}

export interface ResumeTheme {
  fontFamily: 'inter' | 'roboto' | 'opensans' | 'poppins';
  primaryColor: string;
  headingSize: 'sm' | 'md' | 'lg';
  template: 'modern' | 'classic' | 'minimal' | 'creative';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  achievements: Achievement[];
  customSections: CustomSection[];
  theme: ResumeTheme;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  data: ResumeData;
  template: string;
  created_at: string;
  updated_at: string;
}

export interface JobDescription {
  id: string;
  user_id: string;
  resume_id: string;
  description: string;
  analysis?: {
    matchScore: number;
    missingKeywords: string[];
    suggestions: string[];
    strengths: string[];
  };
  score?: number;
  created_at: string;
}