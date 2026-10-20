import { SITE_META, PROJECTS, CONTACTS } from './portfolio-content';

export const site = {
  name: SITE_META.name,
  alias: SITE_META.alias,
  role: SITE_META.role,
  url: SITE_META.url,
  description:
    'Portfolio of Samin Yeasar (SOLEZ), Full Stack Developer and Co-Founder & CTO at MentorMind. Interactive node-graph showcase of systems in React, TypeScript, and Rust.',
  email: SITE_META.email,
  socials: CONTACTS.map((c) => ({ label: c.platform, href: c.url })),
  glPalette: ['#0A0E14', '#162432', '#3DF5A8'] as [string, string, string],
};

export const projects = PROJECTS;
