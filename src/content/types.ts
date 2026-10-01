export type Locale = 'pt' | 'en';

export interface Link {
  label: string;
  href: string;
}

export interface Role {
  title: string;
  period: string;
  current?: true;
  bullets: string[];
  tags: string[];
}

export interface Company {
  name: string;
  location: string;
  roles: Role[];
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
  links: Link[];
}

export interface SkillGroup {
  id: 'tools' | 'data' | 'cloud' | 'languages';
  label: string;
  items: string[];
}

export interface CertificationGroup {
  issuer: string;
  items: string[];
}

/** Slot futuro: a seção "Escritos" só aparece quando houver itens. */
export interface Post {
  title: string;
  href: string;
  date: string;
}

export interface UiStrings {
  nav: { experience: string; projects: string; stack: string; contact: string };
  languageLabel: string;
  menu: string;
  skipToContent: string;
  downloadCv: string;
  cvShort: string;
  contactMe: string;
  photoAlt: string;
  current: string;
  experienceEyebrow: string;
  experienceHeading: string;
  earlierHeading: string;
  projectsEyebrow: string;
  projectsHeading: string;
  seeAllGithub: string;
  stackEyebrow: string;
  stackHeading: string;
  educationEyebrow: string;
  educationHeading: string;
  educationLabel: string;
  certificationsLabel: string;
  writingHeading: string;
  contactEyebrow: string;
  contactHeading: string;
  contactText: string;
  builtWith: string;
}

export interface CV {
  locale: Locale;
  meta: { title: string; description: string; ogImage: string; ogAlt: string };
  ui: UiStrings;
  person: {
    name: string;
    shortName: string;
    title: string;
    headline: string;
    intro: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
    cvPdf: string;
  };
  experience: Company[];
  earlier: { name: string; period: string; location: string; summary: string };
  projects: Project[];
  githubAll: string;
  skills: SkillGroup[];
  education: { school: string; course: string; location: string };
  certifications: CertificationGroup[];
  writing?: Post[];
}
