export interface Author {
  id: string
  name: string
  role: string
  title: string
  bio: string
  avatar: string
  linkedin?: string
  twitter?: string
  email: string
  beats: string[]
}

export const AUTHORS: Record<string, Author> = {
  'justin-davis': {
    id: 'justin-davis',
    name: 'Justin Davis',
    role: 'Publisher & Editor-in-Chief',
    title: 'Founder & Lead Search Analyst',
    bio: 'Justin Davis is the founder and publisher of AI News (aine.ws). He has spent over a decade analyzing programmatic search infrastructure, algorithmic local ranking systems, and autonomous digital business architecture.',
    avatar: '/authors/justin-davis.jpg',
    linkedin: 'https://www.linkedin.com/in/justin-davis-marketing',
    email: 'j.davis@aine.ws',
    beats: ['Search & AI Overviews', 'GEO Intelligence', 'Autonomous Tools']
  },
  'marcus-vance': {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Senior Voice AI & Lead Response Reporter',
    title: 'Lead Voice AI Correspondent',
    bio: 'Marcus Vance investigates real-time sales voice AI, inbound call routing architectures, and automated speed-to-lead pipelines. He previously covered enterprise B2B software and telecom engineering.',
    avatar: '/authors/marcus-vance.jpg',
    email: 'm.vance@aine.ws',
    beats: ['Voice AI', 'Speed-to-Lead', 'Missed-Call Text Back', 'Lead Response Automation']
  },
  'elena-chen': {
    id: 'elena-chen',
    name: 'Elena Chen',
    role: 'Local Business & Google Maps Contributor',
    title: 'Local Search & Maps Tech Analyst',
    bio: 'Elena Chen covers local business technology, Google Business Profile algorithmic fluctuations, and how small-to-midsize service businesses deploy artificial intelligence to compete with national franchises.',
    avatar: '/authors/elena-chen.jpg',
    email: 'e.chen@aine.ws',
    beats: ['Google Maps AI', 'Local 3-Pack', 'Review Automation', 'SMB Tech']
  }
}
