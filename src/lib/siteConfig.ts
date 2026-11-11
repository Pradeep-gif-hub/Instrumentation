export interface DeveloperProfile {
  name: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
}

export const SITE_LINKS = {
  githubUrl: 'https://github.com/Pradeep-gif-hub',
  linkedinUrl: 'https://www.linkedin.com/in/pradeep-kumar-awasthi/',
  websiteUrl: 'https://www.awasthi.tech/',
  contactEmail: 'pawasthi063@gmail.com',
} as const;

export const DEVELOPERS: readonly DeveloperProfile[] = [
  {
    name: 'Pradeep Awasthi',
    githubUrl: SITE_LINKS.githubUrl,
    linkedinUrl: SITE_LINKS.linkedinUrl,
    websiteUrl: SITE_LINKS.websiteUrl,
  },
  {
    name: 'Shanmukh Datta',
    githubUrl: 'https://github.com/shanmukhdatta',
    linkedinUrl: 'https://www.linkedin.com/in/shanmukh-datta-354859343/',
    websiteUrl: 'https://shanmukhdatta.vercel.app/',
  },
] as const;

