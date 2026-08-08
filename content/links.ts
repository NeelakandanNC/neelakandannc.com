/**
 * Contact channels. Recovered from the previous site's source
 * (src/components/Social.jsx, src/pages/Contact.jsx) per spec §9.
 */
export const links = {
  email: 'mailto:neelakandannithin@gmail.com',
  github: 'https://github.com/NeelakandanNC',
  linkedin: 'https://www.linkedin.com/in/neelakandan-nc',
  x: 'https://x.com/NeelakandanNC',
  youtube: 'https://www.youtube.com/@NeelakandanNC',
  // No Substack existed on the old site. Add the URL here if one is started.
  substack: null,
  resume: '/resume.pdf',
} as const;

export interface Channel {
  label: string;
  handle: string;
  href: string;
  note: string;
}

/** Ordered for the COMMS hub-and-spoke. */
export const channels: Channel[] = [
  {
    label: 'EMAIL',
    handle: 'neelakandannithin@gmail.com',
    href: links.email,
    note: 'Long-form. Proposals, roles, decks.',
  },
  {
    label: 'X',
    handle: '@NeelakandanNC',
    href: links.x,
    note: 'Thinking out loud. Fastest replies.',
  },
  {
    label: 'LINKEDIN',
    handle: 'neelakandan-nc',
    href: links.linkedin,
    note: 'Formal outreach and recruiting.',
  },
  {
    label: 'GITHUB',
    handle: 'NeelakandanNC',
    href: links.github,
    note: 'The source for most of the Marks.',
  },
  {
    label: 'YOUTUBE',
    handle: '@NeelakandanNC',
    href: links.youtube,
    note: 'Build logs, one episode at a time.',
  },
];
