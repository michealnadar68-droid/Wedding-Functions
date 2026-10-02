export interface DemoCredentialAccount {
  id: string;
  role: 'admin' | 'customer' | 'vendor';
  subRole?: 'hall' | 'caterer' | 'photographer' | 'decor';
  roleLabel: string;
  badgeColor: string;
  name: string;
  email: string;
  password: string;
  altPassword?: string;
  businessName?: string;
  location: string;
  description: string;
  permissions: string[];
  demoKey: string;
  avatarUrl: string;
}

export const ALL_WEBSITE_CREDENTIALS: DemoCredentialAccount[] = [
  {
    id: 'cred_admin_01',
    role: 'admin',
    roleLabel: 'Platform Super Admin',
    badgeColor: 'bg-[#1A1A1A] text-[#C5A059] border-[#C5A059]/40',
    name: 'Vikramaditya Verma',
    email: 'admin@elysianweddings.in',
    password: 'Admin@Elysian2026!',
    altPassword: 'admin123',
    location: 'New Delhi HQ',
    description: 'Master platform administrator with supreme control over vendor verification, live publishing, escrow ledgers, and platform operations.',
    permissions: [
      'Approve / Reject new vendor listing submissions with custom feedback',
      'Manage & audit Pan-India Master Bookings & Escrow Registry',
      'Monitor 1,000,000+ member virtual database directory & run concurrency benchmarks',
      'Directly edit and moderate all active marriage halls, caterers, photographers, and decor themes'
    ],
    demoKey: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cred_cust_01',
    role: 'customer',
    roleLabel: 'Host / Couple Client',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    name: 'Priya & Michael Sharma',
    email: 'priya.sharma@elysianweddings.com',
    password: 'Priya@Sharma2026',
    altPassword: 'user123',
    location: 'Mumbai & Pan-India',
    description: 'Verified wedding couple client with active date lock reservations, escrow transactions, and vendor chat inquiries.',
    permissions: [
      'Book marriage halls with 20% advance date-hold deposit',
      'Browse and customize 45+ gourmet catering menu items',
      'Live chat with venue managers, masterchefs, and cinematographers',
      'Sync wedding milestones to Google Calendar, Apple iCal, and Outlook'
    ],
    demoKey: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cred_cust_02',
    role: 'customer',
    roleLabel: 'Host / Couple Client',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    name: 'Sarah & David Goldstein',
    email: 'sarah.goldstein@elysianweddings.com',
    password: 'Sarah@Goldstein2026',
    altPassword: 'user123',
    location: 'Bayfront & Harbor Estates',
    description: 'Luxury destination wedding hosts planning a December 2026 celebration.',
    permissions: [
      'Interactive shortlist of favorite coastal & palace venues',
      'Budget allocation and payment gateway dummy simulations',
      'Vendor proposal downloads and brochure exports'
    ],
    demoKey: 'sarah',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cred_cust_03',
    role: 'customer',
    roleLabel: 'Host / Couple Client',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    name: 'Micheal Nadar & Priyadarshini',
    email: 'micheal.nadar@elysianweddings.in',
    password: 'Micheal@Luxury2026',
    altPassword: 'user123',
    location: 'Mumbai / Bangalore',
    description: 'Primary test account for royal vivah and Vedic ceremony reservations.',
    permissions: [
      'Master Muhurtham date reservations & time window booking',
      'Real-time Razorpay escrow sandbox checkout',
      'Full profile and wedding dashboard customization'
    ],
    demoKey: 'micheal',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cred_vendor_01',
    role: 'vendor',
    subRole: 'hall',
    roleLabel: 'Venue Vendor Partner',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
    name: 'Rajesh Singhania',
    businessName: 'The Grand Elysian Palace & Crystal Ballroom',
    email: 'singhania@grandelysian.in',
    password: 'Vendor@Hall2026',
    altPassword: 'vendor123',
    location: 'Mumbai, Maharashtra',
    description: 'Manager of verified 1,500-capacity centralized HVAC banquet halls with valet & dining facilities.',
    permissions: [
      'Publish new luxury convention halls with high-res galleries',
      'Set guest capacities, pricing tiers, and time windows',
      'Track booking requests and date-lock inquiries',
      'View real-time listing conversion analytics & performance'
    ],
    demoKey: 'vendor_hall',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cred_vendor_02',
    role: 'vendor',
    subRole: 'caterer',
    roleLabel: 'Catering Vendor Partner',
    badgeColor: 'bg-rose-50 text-rose-900 border-rose-300',
    name: 'Masterchef Anand Mehrotra',
    businessName: 'Royal Shahi Rasoi Gourmet Banquet',
    email: 'chef.anand@shahirasoi.in',
    password: 'Vendor@Catering2026',
    altPassword: 'vendor123',
    location: 'Delhi NCR, Delhi',
    description: 'Heritage culinary master managing 45+ dish multi-course banquets, Satvik food, and live counters.',
    permissions: [
      'Publish gourmet menu courses (Appetizers, Chaat, Mains, Desserts)',
      'Configure per-plate tier pricing and minimum plate thresholds',
      'Respond to guest dietary requirements (Jain, Pure Veg, Vegan)',
      'Receive instant wedding quote requests'
    ],
    demoKey: 'vendor_caterer',
    avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cred_vendor_03',
    role: 'vendor',
    subRole: 'photographer',
    roleLabel: 'Cinematography Partner',
    badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-300',
    name: 'Arjun Verma',
    businessName: 'Luminary Cine Studios & Drone Team',
    email: 'arjun@luminarycinestudios.in',
    password: 'Vendor@Photo2026',
    altPassword: 'vendor123',
    location: 'Bengaluru, Karnataka',
    description: 'Lead cinematographer offering 4K drone videography, candid photography, and wedding teasers.',
    permissions: [
      'Upload 4K photography portfolios & milestone event reels',
      'Define daily shooting rates, crew sizes, and gear lists',
      'Provide same-day wedding teaser options',
      'Manage availability calendar for Muhurtham dates'
    ],
    demoKey: 'vendor_photographer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cred_vendor_04',
    role: 'vendor',
    subRole: 'decor',
    roleLabel: 'Decor & Mandap Partner',
    badgeColor: 'bg-purple-50 text-purple-900 border-purple-300',
    name: 'Kavita Rathore',
    businessName: 'Kalakriti Luxury Decor & Floral Staging',
    email: 'design@kalakritidecor.in',
    password: 'Vendor@Decor2026',
    altPassword: 'vendor123',
    location: 'Jaipur, Rajasthan',
    description: 'Artistic decor team specializing in Royal Rajwada mandaps, floral chandeliers, and thematic staging.',
    permissions: [
      'Publish 3D staging themes and architectural mandap packages',
      'Specify ceiling height requirements and stage dimensions',
      'Configure color palettes (Hex values) and floral elements',
      'Track couple likes, theme popularity, and quote inquiries'
    ],
    demoKey: 'vendor_decor',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  }
];
