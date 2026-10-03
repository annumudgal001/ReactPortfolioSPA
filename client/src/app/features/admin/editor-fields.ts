export interface Field { key: string; label: string; type?: 'text' | 'textarea' | 'list' | 'boolean' | 'number' | 'icon'; required?: boolean; }
export const contentKeys = ['name', 'headline', 'summary', 'jargon', 'location', 'email', 'phone', 'photoUrl', 'resumeUrl', 'seoDescription', 'socials', 'experience', 'education', 'skillGroups', 'services', 'certifications', 'testimonials', 'quotes'] as const;
export const sections = [
  { key: 'profile', label: 'Profile & contact' }, { key: 'projects', label: 'Projects' },
  { key: 'services', label: 'Services' }, { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' }, { key: 'skillGroups', label: 'Skills' },
  { key: 'certifications', label: 'Certificates' }, { key: 'testimonials', label: 'Testimonials' },
  { key: 'quotes', label: 'Quotes' }, { key: 'jargon', label: 'Hero phrases' },
  { key: 'messages', label: 'Contact inbox' }, { key: 'feedback', label: 'Reviews' },
];
export const fields: Record<string, Field[]> = {
  profile: [
    { key: 'name', label: 'Display name', required: true }, { key: 'headline', label: 'Headline', required: true },
    { key: 'summary', label: 'Introduction', type: 'textarea', required: true }, { key: 'location', label: 'Location' },
    { key: 'email', label: 'Public email' }, { key: 'phone', label: 'Public phone' },
    { key: 'photoUrl', label: 'Profile image URL or /path' }, { key: 'resumeUrl', label: 'Resume URL or /path' },
    { key: 'seoDescription', label: 'Search description', type: 'textarea' },
  ],
  projects: [
    { key: 'title', label: 'Title', required: true }, { key: 'slug', label: 'URL slug', required: true },
    { key: 'description', label: 'Short description', type: 'textarea', required: true }, { key: 'details', label: 'Case study', type: 'textarea' },
    { key: 'highlights', label: 'Highlights (one per line)', type: 'list' }, { key: 'technologies', label: 'Technologies (one per line)', type: 'list' },
    { key: 'thumbnail', label: 'Screenshot URL or /path' }, { key: 'repoUrl', label: 'Repository HTTPS URL' }, { key: 'liveUrl', label: 'Demo HTTPS URL' },
    { key: 'order', label: 'Display order', type: 'number' }, { key: 'featured', label: 'Featured on home', type: 'boolean' },
    { key: 'published', label: 'Visible publicly', type: 'boolean' },
  ],
  services: [{ key: 'title', label: 'Service name', required: true }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'icon', label: 'Icon', type: 'icon' }, { key: 'tags', label: 'Tags (one per line)', type: 'list' }],
  experience: [{ key: 'company', label: 'Company', required: true }, { key: 'role', label: 'Role', required: true }, { key: 'type', label: 'Employment type' }, { key: 'period', label: 'Period' }, { key: 'location', label: 'Location' }, { key: 'industry', label: 'Industry' }, { key: 'summary', label: 'Responsibilities', type: 'textarea' }, { key: 'logo', label: 'Logo URL or /path' }, { key: 'current', label: 'Current role', type: 'boolean' }],
  education: [{ key: 'degree', label: 'Degree', required: true }, { key: 'institution', label: 'Institution' }, { key: 'period', label: 'Period' }, { key: 'score', label: 'Score' }, { key: 'logo', label: 'Logo URL or /path' }, { key: 'coursework', label: 'Coursework (one per line)', type: 'list' }, { key: 'summary', label: 'Summary', type: 'textarea' }],
  skillGroups: [{ key: 'category', label: 'Category', required: true }],
  certifications: [{ key: 'title', label: 'Certificate name', required: true }, { key: 'issuer', label: 'Issuer' }, { key: 'image', label: 'Certificate URL or /path' }],
  testimonials: [{ key: 'author', label: 'Author', required: true }, { key: 'role', label: 'Author role' }, { key: 'quote', label: 'Testimonial', type: 'textarea', required: true }],
  quotes: [{ key: 'title', label: 'Title', required: true }, { key: 'text', label: 'Quote', type: 'textarea', required: true }],
};
export const icons = ['faSolidLaptopCode', 'faSolidRocket', 'faSolidPalette', 'faSolidServer', 'faSolidDatabase', 'faSolidRobot', 'faSolidBolt', 'faSolidBug', 'faSolidCloud', 'faSolidUsers', 'faSolidGears', 'faSolidCode'];
export function emptyRecord(section: string): Record<string, any> {
  const value: Record<string, any> = { id: crypto.randomUUID() };
  for (const field of fields[section] || []) value[field.key] = field.type === 'list' ? [] : field.type === 'boolean' ? false : field.type === 'number' ? 0 : '';
  if (section === 'skillGroups') value['items'] = [];
  if (section === 'projects') { delete value['id']; value['published'] = false; }
  return value;
}
