export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Socials {
  github: string;
  linkedin: string;
  leetcode: string;
  twitter: string;
  instagram: string;
}

export interface Experience {
  id?: string;
  company: string;
  role: string;
  type: string;
  period: string;
  location: string;
  industry: string;
  summary: string;
  logo: string;
  current: boolean;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  period: string;
  score: string;
  logo: string;
  coursework: string[];
  summary: string;
}

export interface SkillItem {
  id?: string;
  name: string;
  description: string;
}

export interface SkillGroup {
  id?: string;
  category: string;
  items: SkillItem[];
}

export interface ServiceOffering {
  id?: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface Certification {
  id?: string;
  title: string;
  issuer: string;
  image: string;
}

export interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  role: string;
}

export interface Quote {
  id?: string;
  title: string;
  text: string;
}

export interface Profile {
  photoUrl: string;
  seoDescription: string;
  name: string;
  headline: string;
  jargon: string[];
  summary: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl: string;
  socials: Socials;
  experience: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  services: ServiceOffering[];
  certifications: Certification[];
  testimonials: Testimonial[];
  quotes: Quote[];
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  details: string;
  highlights: string[];
  technologies: string[];
  thumbnail: string;
  repoUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website: string;
}

export interface FeedbackPayload {
  name: string;
  rating: number;
  message: string;
  website: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
