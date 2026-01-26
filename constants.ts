
import { StageId, StageInfo } from './types';

export const COLORS = {
  PRIMARY: '#EC1B23',      // Modern Red
  SECONDARY: '#0F172A',    // Deep Blue
  BACKGROUND: '#020617',   // Dark Space
  SURFACE: '#1E293B',      // Slate surface
  ACCENT: '#10B981',       // Green for success
  TEXT_MAIN: '#F8FAFC',    // White
  TEXT_MUTED: '#94A3B8'    // Gray
};

export const STAGES_CONFIG: Record<StageId, StageInfo> = {
  [StageId.REGISTRATION]: {
    id: StageId.REGISTRATION,
    name: '1. Register Company',
    price: 'R495',
    description: 'We help you register with CIPC and get your official papers.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.LOGO]: {
    id: StageId.LOGO,
    name: '2. Your Logo',
    price: 'From R70',
    description: 'Get a professional look for your new business brand.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.PROFILE]: {
    id: StageId.PROFILE,
    name: '3. Business Profile',
    price: 'Get Quote',
    description: 'A document that explains your services to customers.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.PLAN]: {
    id: StageId.PLAN,
    name: '4. Business Plan',
    price: 'Get Quote',
    description: 'A clear guide on how your business will grow and make money.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.COMPLIANCE]: {
    id: StageId.COMPLIANCE,
    name: '5. Industry Licenses',
    price: 'Get Quote',
    description: 'Special permits like CIDB, PSIRA, or COIDA for your work.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.WEBSITE]: {
    id: StageId.WEBSITE,
    name: '6. Website Design',
    price: 'Get Quote',
    description: 'Your own website so customers can find you online.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.SOCIAL]: {
    id: StageId.SOCIAL,
    name: '7. Social Media',
    price: 'Get Quote',
    description: 'Set up Facebook and Instagram to talk to customers.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.SEO]: {
    id: StageId.SEO,
    name: '8. Google & Maps',
    price: 'Get Quote',
    description: 'Show up on Google Maps when people search for your services.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.MARKETING]: {
    id: StageId.MARKETING,
    name: '9. Find Customers',
    price: 'Get Quote',
    description: 'Run ads to get phone calls from people who need your help.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.CRM]: {
    id: StageId.CRM,
    name: '10. Sales Tools',
    price: 'Get Quote',
    description: 'Smart tools to help you track customers and invoices.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.MAINTENANCE]: {
    id: StageId.MAINTENANCE,
    name: '11. Annual Returns',
    price: 'Get Quote',
    description: 'Keep your company active with yearly CIPC and Tax filings.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  },
  [StageId.REMOTE_ADMIN]: {
    id: StageId.REMOTE_ADMIN,
    name: '12. Office Assistant',
    price: 'Get Quote',
    description: 'A real person to help you with typing, calls, and emails.',
    isUnlocked: true,
    status: 'NOT_STARTED'
  }
};

export const NICHES = [
  'Construction & Building', 'Cleaning Services', 'Security Guarding', 'Transport & Logistics', 'General Trading', 'IT & Computers', 
  'Consulting', 'Farming', 'Retail Shop', 'Teaching & Training'
];
