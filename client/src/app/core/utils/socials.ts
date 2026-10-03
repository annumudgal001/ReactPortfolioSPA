import { Socials } from '../models/portfolio.models';

export interface SocialLink {
  label: string;
  icon: string;
  url: string;
}

export function socialLinks(socials: Socials): SocialLink[] {
  const all: SocialLink[] = [
    { label: 'GitHub', icon: 'faBrandGithub', url: socials.github },
    { label: 'LinkedIn', icon: 'faBrandLinkedin', url: socials.linkedin },
    { label: 'LeetCode', icon: 'faSolidCode', url: socials.leetcode },
    { label: 'X (Twitter)', icon: 'faBrandXTwitter', url: socials.twitter },
    { label: 'Instagram', icon: 'faBrandInstagram', url: socials.instagram },
  ];

  return all.filter((link) => Boolean(link.url));
}
