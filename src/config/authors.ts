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
    beats: ['Search Algorithms', 'GEO Intelligence', 'Enterprise Architecture']
  },
  'marcus-vance': {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Senior Telephony & Automation Reporter',
    title: 'Senior Telecom & RevOps Correspondent',
    bio: 'Marcus Vance investigates real-time sales telephony, inbound call routing architectures, and CRM pipeline automation. He previously covered enterprise B2B software and VoIP engineering.',
    avatar: '/authors/marcus-vance.jpg',
    email: 'm.vance@aine.ws',
    beats: ['Sales Telephony', 'Voice AI', 'Speed-to-Lead', 'CRM Infrastructure']
  },
  'elena-chen': {
    id: 'elena-chen',
    name: 'Elena Chen',
    role: 'Local Commerce & Maps Contributor',
    title: 'Local Search & Retail Tech Analyst',
    bio: 'Elena Chen covers local business technology, Google Business Profile algorithmic fluctuations, and how small-to-midsize service businesses deploy artificial intelligence to compete with national franchises.',
    avatar: '/authors/elena-chen.jpg',
    email: 'e.chen@aine.ws',
    beats: ['Google Maps AI', 'Local 3-Pack', 'Review Automation', 'SMB Tech']
  }
}
