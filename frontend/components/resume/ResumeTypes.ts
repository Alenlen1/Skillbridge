export interface ResumeSkill {
  id: string;
  name: string;
  category: string | null;
  level: string | null;
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string | null;
  field: string | null;
  startYear: number | null;
  endYear: number | null;
  current: boolean;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string | null;
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string | null;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
}

export interface ResumeCertificate {
  id: string;
  title: string;
  issuer: string;
  category: string;
}

export interface ResumeSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ResumeData {
  name: string;
  username: string;
  email: string;
  headline: string | null;
  about: string | null;
  location: string | null;
  website: string | null;
  phone: string | null;
  skills: ResumeSkill[];
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  certificates: ResumeCertificate[];
  socialLinks: ResumeSocialLink[];
}
