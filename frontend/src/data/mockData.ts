// BizNexuz — Interconnected mock data

export type Role =
  | 'Business Owner'
  | 'Sales Manager'
  | 'Sales Executive'
  | 'Marketing Manager'
  | 'Inventory Manager'
  | 'Purchase Manager'
  | 'Finance Manager'
  | 'Business Analyst';

export interface DemoUser {
  id: string;
  name: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  password?: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  leadType: 'Retailer' | 'Wholesaler' | 'Distributor' | 'Business' | 'Enterprise' | 'Social Lead' | 'Referral';
  source: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Website' | 'Sales Team' | 'Referral' | 'Events' | 'Email' | 'Other';
  stage: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  potentialValue: number;
  probability: number;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  createdDate: string;
  lastActivity: string;
  nextFollowUp: string;
  expectedClose: string;
  campaignId?: string;
  notes: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'quote' | 'system';
  title: string;
  description: string;
  date: string;
  user: string;
}

export interface Customer {
  id: string;
  businessName: string;
  customerType: 'Retailer' | 'Wholesaler' | 'Distributor' | 'Business' | 'Enterprise';
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  accountOwner: string;
  status: 'Active' | 'Inactive' | 'At Risk';
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  outstanding: number;
  lastPurchase: string;
  customerSince: string;
  taxId: string;
  website: string;
  address: string;
  notes: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number;
  cost: number;
  currentStock: number;
  reorderLevel: number;
  supplierId: string;
  status: 'Active' | 'Inactive' | 'Low Stock' | 'Out of Stock';
  unitsSold: number;
}

export interface SalesOrder {
  id: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  orderDate: string;
  salesperson: string;
  billingAddress: string;
  shippingAddress: string;
  paymentStatus: 'Pending' | 'Partial' | 'Paid';
  fulfillmentStatus: 'Draft' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  invoiceId?: string;
  notes: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  productName?: string;
  total?: number;
  description?: string;
}

export interface Quotation {
  id: string;
  customerId?: string;
  leadId?: string;
  items: OrderItem[];
  total: number;
  createdDate: string;
  expiryDate: string;
  salesperson: string;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';
  notes: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue';
  items: OrderItem[];
}

export interface Payment {
  id: string;
  customerId: string;
  invoiceId: string;
  amount: number;
  method: 'Bank Transfer' | 'UPI' | 'Card' | 'Cash' | 'Other' | string;
  date: string;
  reference: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Expense {
  id: string;
  category: 'Operations' | 'Marketing' | 'Travel' | 'Salaries' | 'Procurement' | 'Utilities' | 'Other';
  description: string;
  amount: number;
  date: string;
  department: string;
  submittedBy: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  products: string[];
  totalOrders: number;
  totalPurchase: number;
  outstanding: number;
  rating: number;
  status: 'Active' | 'Inactive';
  leadTime: number;
  paymentTerms?: string;
  taxId?: string;
  address?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: { productId: string; quantity: number; unitCost: number; productName?: string; total?: number }[];
  total: number;
  orderDate: string;
  expectedDate: string;
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Received' | 'Cancelled';
  notes?: string;
}

export interface SocialPost {
  id: string;
  title: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn';
  content: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  publishDate: string;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  enquiries: number;
  leadsGenerated: number;
  qualifiedLeads: number;
  conversions: number;
  revenueAttributed: number;
  campaignId: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Multi-platform';
  startDate: string;
  endDate: string;
  reach: number;
  engagement: number;
  leads: number;
  conversions: number;
  revenue: number;
  roi: number;
  status: 'Active' | 'Completed' | 'Paused' | 'Draft';
  budget: number;
  spend: number;
}

export interface Notification {
  id: string;
  type: 'lead' | 'invoice' | 'stock' | 'campaign' | 'quotation' | 'order' | 'payment';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Document {
  id: string;
  name: string;
  category: 'Invoice' | 'Quotation' | 'Purchase Order' | 'Contract' | 'Report' | 'Business Document';
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  status: 'Indexed' | 'Processing' | 'Failed';
  linkedTo?: string;
}

// ─── Demo Users ───────────────────────────────────────────────────────────────

export const demoUsers: DemoUser[] = [
  { id: 'u1', name: 'Suresh Narayanan', email: 'suresh@nestle.in', role: 'Business Owner', avatar: 'SN', department: 'Executive' },
  { id: 'u2', name: 'Rahul Sharma', email: 'rahul.sharma@nestle.in', role: 'Sales Manager', avatar: 'RS', department: 'Sales & Modern Trade' },
  { id: 'u3', name: 'Priya Shah', email: 'priya.shah@nestle.in', role: 'Sales Executive', avatar: 'PS', department: 'Key Account Sales' },
  { id: 'u4', name: 'Kavya Nair', email: 'kavya.nair@nestle.in', role: 'Marketing Manager', avatar: 'KN', department: 'Brand Marketing' },
  { id: 'u5', name: 'Vikram Rao', email: 'vikram.rao@nestle.in', role: 'Inventory Manager', avatar: 'VR', department: 'Supply Chain & Cold Storage' },
  { id: 'u6', name: 'Sanjay Kumar', email: 'sanjay.kumar@nestle.in', role: 'Purchase Manager', avatar: 'SK', department: 'Agro Procurement' },
  { id: 'u7', name: 'Neha Patel', email: 'neha.patel@nestle.in', role: 'Finance Manager', avatar: 'NP', department: 'Commercial Finance' },
  { id: 'u8', name: 'Aisha Khan', email: 'aisha.khan@nestle.in', role: 'Business Analyst', avatar: 'AK', department: 'Demand Analytics' },
];

// ─── Customers ────────────────────────────────────────────────────────────────

export const customers: Customer[] = [
  {
    id: 'c1', businessName: 'Reliance Retail Ventures Ltd', customerType: 'Enterprise',
    contactPerson: 'Suresh Menon', email: 'suresh.menon@relianceretail.com', phone: '+91 98765 43210',
    location: 'Mumbai, MH', industry: 'Supermarket Chains & Hypermarkets', accountOwner: 'Rahul Sharma',
    status: 'Active', totalOrders: 142, totalRevenue: 4840000, avgOrderValue: 34085, outstanding: 184000,
    lastPurchase: '2025-08-28', customerSince: '2021-03-15',
    taxId: 'GSTIN27AAACR1234F1Z5', website: 'www.relianceretail.com',
    address: 'Reliance Corporate Park, Thane-Belapur Road, Navi Mumbai 400701',
    notes: 'Primary national modern-trade retail account. Rapid weekly replenishment on Maggi & Nescafé lines.',
  },
  {
    id: 'c2', businessName: 'Avenue Supermarts Ltd (DMart)', customerType: 'Enterprise',
    contactPerson: 'Anjali Desai', email: 'anjali.desai@dmartindia.com', phone: '+91 99887 65432',
    location: 'Thane, MH', industry: 'FMCG Retail Chains', accountOwner: 'Rahul Sharma',
    status: 'Active', totalOrders: 128, totalRevenue: 5620000, avgOrderValue: 43906, outstanding: 96000,
    lastPurchase: '2025-09-01', customerSince: '2020-11-08',
    taxId: 'GSTIN27AABCA5678G2Z6', website: 'www.dmartindia.com',
    address: 'B-72, Wagle Industrial Estate, Road No. 33, Thane 400604',
    notes: 'Highest volume FMCG grocery buyer across Western and Southern India.',
  },
  {
    id: 'c3', businessName: 'Blinkit Commerce Dark Stores', customerType: 'Distributor',
    contactPerson: 'Rajan Pillai', email: 'rajan.pillai@blinkit.com', phone: '+91 97654 32109',
    location: 'Gurugram, HR', industry: 'Quick Commerce & Grocery Delivery', accountOwner: 'Priya Shah',
    status: 'Active', totalOrders: 94, totalRevenue: 2860000, avgOrderValue: 30426, outstanding: 42000,
    lastPurchase: '2025-08-20', customerSince: '2023-01-20',
    taxId: 'GSTIN06AABCG9012H3Z7', website: 'www.blinkit.com',
    address: 'Plot 45, Udyog Vihar Phase IV, Gurugram 122015',
    notes: 'Dark store instant inventory hub with 48-hour automated dispatch cycle.',
  },
  {
    id: 'c4', businessName: 'Metro Cash & Carry Wholesale', customerType: 'Wholesaler',
    contactPerson: 'Meera Iyer', email: 'meera.iyer@metro-cc.in', phone: '+91 96543 21098',
    location: 'Bangalore, KA', industry: 'B2B Wholesale & HoReCa Supply', accountOwner: 'Priya Shah',
    status: 'Active', totalOrders: 85, totalRevenue: 3440000, avgOrderValue: 40471, outstanding: 62000,
    lastPurchase: '2025-09-02', customerSince: '2021-07-12',
    taxId: 'GSTIN29AABCM3456I4Z8', website: 'www.metro-cc.in',
    address: '26/3, Industrial Suburb, Yeshwantpur, Bangalore 560022',
    notes: 'Major B2B cash & carry supplying restaurants, caterers, and local kirana networks.',
  },
  {
    id: 'c5', businessName: 'Swiggy Instamart Urban Fulfillment', customerType: 'Distributor',
    contactPerson: 'Deepak Joshi', email: 'deepak.joshi@swiggy.in', phone: '+91 95432 10987',
    location: 'Delhi, DL', industry: 'Quick Commerce Fulfillment', accountOwner: 'Rahul Sharma',
    status: 'Active', totalOrders: 72, totalRevenue: 2680000, avgOrderValue: 37222, outstanding: 220000,
    lastPurchase: '2025-08-15', customerSince: '2022-05-03',
    taxId: 'GSTIN07AABCS7890J5Z9', website: 'www.swiggy.com',
    address: '15, Okhla Industrial Area Phase III, New Delhi 110020',
    notes: 'High demand for KitKat, Maggi Cuppa, and Nescafé Cold Coffee cans.',
  },
  {
    id: 'c6', businessName: 'Cafe Coffee Day & HoReCa Institutional', customerType: 'Enterprise',
    contactPerson: 'Shruti Banerjee', email: 'shruti.banerjee@cafecoffeeday.com', phone: '+91 94321 09876',
    location: 'Hyderabad, TS', industry: 'HoReCa & Hospitality Foodservice', accountOwner: 'Rahul Sharma',
    status: 'Active', totalOrders: 45, totalRevenue: 1820000, avgOrderValue: 40444, outstanding: 0,
    lastPurchase: '2025-08-30', customerSince: '2022-06-10',
    taxId: 'GSTIN36AABCC2345K6Z0', website: 'www.cafecoffeeday.com',
    address: 'Level 8, HITEC City, Madhapur, Hyderabad 500081',
    notes: 'Institutional client sourcing Nescafé vending coffee beans and Milkmaid bulk packs.',
  },
  {
    id: 'c7', businessName: "Spencer's Retail Eastern Hub", customerType: 'Retailer',
    contactPerson: 'Arun Krishnan', email: 'arun.krishnan@spencersretail.com', phone: '+91 93210 98765',
    location: 'Kolkata, WB', industry: 'Supermarkets & Grocery Retail', accountOwner: 'Priya Shah',
    status: 'At Risk', totalOrders: 38, totalRevenue: 1250000, avgOrderValue: 32895, outstanding: 95000,
    lastPurchase: '2025-07-10', customerSince: '2023-02-28',
    taxId: 'GSTIN19AABCS6789L7Z1', website: 'www.spencersretail.com',
    address: '31, Shakespeare Sarani, Kolkata 700017',
    notes: 'Follow-up required on monsoon inventory buffer for Cerelac and Everyday dairy powders.',
  },
];

// ─── Leads ────────────────────────────────────────────────────────────────────

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leads: Lead[] = [
  {
    id: 'l1', companyName: 'Zepto Quick Grocery Hubs', contactPerson: 'Vivek Kapoor',
    email: 'vivek.kapoor@zepto.in', phone: '+91 98001 23456', location: 'Jaipur, RJ',
    industry: 'Quick Commerce & Grocery', leadType: 'Retailer', source: 'Website', stage: 'Proposal',
    potentialValue: 1480000, probability: 75, priority: 'High', assignedTo: 'Priya Shah',
    createdDate: '2025-07-15', lastActivity: '2025-09-01', nextFollowUp: '2025-09-05',
    expectedClose: '2025-09-30', campaignId: 'camp1', notes: 'Expansion of dark store FMCG distribution across 18 new micro-warehouses.',
    activities: [
      { id: 'a1', type: 'system', title: 'Lead created from B2B Portal', description: 'Inbound enquiry for Maggi & Nescafé bulk pallets.', date: '2025-07-15', user: 'System' },
      { id: 'a2', type: 'call', title: 'Category manager discovery call', description: '30-min call. High weekly stock turnover projection.', date: '2025-07-20', user: 'Priya Shah' },
      { id: 'a3', type: 'email', title: 'FMCG product catalog sent', description: 'Sent official wholesale pricing matrix and MOQs.', date: '2025-07-25', user: 'Priya Shah' },
      { id: 'a4', type: 'quote', title: 'Quotation delivered', description: 'QT-1085 master price agreement delivered.', date: '2025-08-10', user: 'Priya Shah' },
      { id: 'a5', type: 'email', title: 'Commercial negotiation', description: 'Prospect requested revised tiered rebates on Maggi cartons.', date: '2025-09-01', user: 'Priya Shah' },
    ],
  },
  {
    id: 'l2', companyName: 'Taj Hotels F&B Procurement', contactPerson: 'Mohan Lal',
    email: 'mohan.lal@tajhotels.com', phone: '+91 97002 34567', location: 'Mumbai, MH',
    industry: 'Luxury Hospitality & Catering', leadType: 'Enterprise', source: 'Sales Team', stage: 'Qualified',
    potentialValue: 2400000, probability: 60, priority: 'High', assignedTo: 'Rahul Sharma',
    createdDate: '2025-08-01', lastActivity: '2025-08-28', nextFollowUp: '2025-09-06',
    expectedClose: '2025-10-15', campaignId: 'camp2', notes: 'Annual master contract for Nescafé beans, Nestea, and Milkmaid across 32 properties.',
    activities: [
      { id: 'a6', type: 'system', title: 'Institutional lead created', description: 'Referral from hospitality culinary association.', date: '2025-08-01', user: 'System' },
      { id: 'a7', type: 'meeting', title: 'Executive tasting session', description: 'Tasting of specialty Nescafé blends and culinary Milkmaid recipes.', date: '2025-08-20', user: 'Rahul Sharma' },
      { id: 'a8', type: 'quote', title: 'Institutional quote submitted', description: 'Delivered QT-1084 with HoReCa bulk discounts.', date: '2025-08-28', user: 'Rahul Sharma' },
    ],
  },
  {
    id: 'l3', companyName: 'Haldiram Snacks & Sweets Chain', contactPerson: 'Sanjay Aggarwal',
    email: 'sanjay@haldirams.com', phone: '+91 96003 45678', location: 'Nagpur, MH',
    industry: 'Confectionery & QSR Retail', leadType: 'Wholesaler', source: 'LinkedIn', stage: 'Negotiation',
    potentialValue: 1850000, probability: 80, priority: 'High', assignedTo: 'Rahul Sharma',
    createdDate: '2025-06-20', lastActivity: '2025-09-02', nextFollowUp: '2025-09-04',
    expectedClose: '2025-09-20', campaignId: 'camp3', notes: 'Procuring bulk condensed milk for festive sweet production.',
    activities: [
      { id: 'a9', type: 'system', title: 'Inbound enterprise inquiry', description: 'Industrial culinary ingredients inquiry.', date: '2025-06-20', user: 'System' },
      { id: 'a10', type: 'meeting', title: 'Factory technical audit', description: 'Food safety and cold-chain compliance verified.', date: '2025-07-10', user: 'Rahul Sharma' },
      { id: 'a11', type: 'quote', title: 'Bulk Milkmaid quotation sent', description: 'QT-1083 submitted for 1,200 master trays.', date: '2025-07-25', user: 'Rahul Sharma' },
      { id: 'a12', type: 'call', title: 'Final pricing call', description: 'Rebate structure accepted. Awaiting contract signature.', date: '2025-09-02', user: 'Rahul Sharma' },
    ],
  },
  {
    id: 'l4', companyName: 'BigBasket B2B Wholesale Hubs', contactPerson: 'Anita Rao',
    email: 'anita.rao@bigbasket.com', phone: '+91 95004 56789', location: 'Bengaluru, KA',
    industry: 'Online Supermarket Distribution', leadType: 'Distributor', source: 'Referral', stage: 'Contacted',
    potentialValue: 3200000, probability: 45, priority: 'High', assignedTo: 'Priya Shah',
    createdDate: '2025-08-18', lastActivity: '2025-08-22', nextFollowUp: '2025-09-08',
    expectedClose: '2025-11-01', campaignId: undefined, notes: 'National warehouse distribution tender for baby nutrition and instant noodles.',
    activities: [
      { id: 'a13', type: 'system', title: 'Tender request ingested', description: 'RFP documents received for Q4 FY26 supply.', date: '2025-08-18', user: 'System' },
      { id: 'a14', type: 'email', title: 'Capabilities deck delivered', description: 'Shared packaging specs and manufacturing certifications.', date: '2025-08-22', user: 'Priya Shah' },
    ],
  },
  {
    id: 'l5', companyName: 'More Retail Supermarket Network', contactPerson: 'Gaurav Sen',
    email: 'gaurav.sen@moreretail.in', phone: '+91 94005 67890', location: 'Chandigarh, PB',
    industry: 'Supermarket Retail Chain', leadType: 'Retailer', source: 'Facebook', stage: 'New',
    potentialValue: 920000, probability: 30, priority: 'Medium', assignedTo: 'Priya Shah',
    createdDate: '2025-09-01', lastActivity: '2025-09-01', nextFollowUp: '2025-09-07',
    expectedClose: '2025-11-30', campaignId: 'camp1', notes: 'Replenishment for 42 regional grocery branches in Northern India.',
    activities: [
      { id: 'a15', type: 'system', title: 'Inbound retail inquiry', description: 'Campaign form submission from Retail Growth campaign.', date: '2025-09-01', user: 'System' },
    ],
  },
  {
    id: 'l6', companyName: 'Chaayos Institutional Supply', contactPerson: 'Raghav Verma',
    email: 'raghav@chaayos.com', phone: '+91 93006 78901', location: 'Mumbai, MH',
    industry: 'Hospitality & Tea Cafe Chain', leadType: 'Enterprise', source: 'Events', stage: 'Won',
    potentialValue: 1650000, probability: 100, priority: 'High', assignedTo: 'Rahul Sharma',
    createdDate: '2025-04-10', lastActivity: '2025-07-15', nextFollowUp: '',
    expectedClose: '2025-07-15', campaignId: undefined, notes: 'Converted to active contract. Sourcing Nestlé Everyday Dairy Whitener and Nestea mixes.',
    activities: [
      { id: 'a16', type: 'system', title: 'Met at Food Expo Mumbai', description: 'Key account discussion at International Food Forum.', date: '2025-04-10', user: 'System' },
      { id: 'a17', type: 'meeting', title: 'Bulk supply agreement finalized', description: 'Commercial agreement confirmed for 120 stores.', date: '2025-05-20', user: 'Suresh Narayanan' },
      { id: 'a18', type: 'quote', title: 'Master contract signed', description: 'Contract accepted and dispatched.', date: '2025-07-15', user: 'Rahul Sharma' },
    ],
  },
  {
    id: 'l7', companyName: 'Blue Tokai Specialty Roasters Hub', contactPerson: 'Farhan Sheikh',
    email: 'farhan@bluetokai.in', phone: '+91 92007 89012', location: 'Ahmedabad, GJ',
    industry: 'Artisanal Cafe Retail', leadType: 'Distributor', source: 'Instagram', stage: 'Lost',
    potentialValue: 480000, probability: 0, priority: 'Low', assignedTo: 'Priya Shah',
    createdDate: '2025-05-01', lastActivity: '2025-07-30', nextFollowUp: '',
    expectedClose: '2025-07-30', campaignId: 'camp2', notes: 'Opted for single-origin estate direct sourcing.',
    activities: [
      { id: 'a19', type: 'system', title: 'Marked as lost', description: 'Prospect chose boutique micro-roaster.', date: '2025-07-30', user: 'Priya Shah' },
    ],
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const products: Product[] = [
  { id: 'p1', sku: 'NES-MAG-001', name: 'Maggi 2-Minute Masala Noodles (Master Carton - 96 packs)', category: 'Instant Foods', description: 'Iconic instant noodles with authentic Indian spice blend, 96-pack bulk case', price: 1440, cost: 960, currentStock: 1250, reorderLevel: 200, supplierId: 's3', status: 'Active', unitsSold: 420 },
  { id: 'p2', sku: 'NES-COF-002', name: 'Nescafé Classic Instant Coffee (Glass Jar 200g - Case of 24)', category: 'Beverages & Coffee', description: '100% pure roasted coffee granules, master wholesale shipping case', price: 13200, cost: 8400, currentStock: 480, reorderLevel: 80, supplierId: 's2', status: 'Active', unitsSold: 280 },
  { id: 'p3', sku: 'NES-KIT-003', name: 'KitKat 4-Finger Milk Chocolate Wafer (Box of 48 Bars)', category: 'Confectionery', description: 'Crisp wafer finger bar covered in smooth milk chocolate, shelf-ready display pack', price: 1920, cost: 1200, currentStock: 850, reorderLevel: 150, supplierId: 's1', status: 'Active', unitsSold: 510 },
  { id: 'p4', sku: 'NES-MLK-004', name: 'Nestlé Milkmaid Sweetened Condensed Milk (Tin 400g - Tray of 24)', category: 'Dairy & Culinary', description: 'Premium condensed milk for desserts, confectionery and culinary bakery applications', price: 3840, cost: 2600, currentStock: 620, reorderLevel: 100, supplierId: 's1', status: 'Active', unitsSold: 210 },
  { id: 'p5', sku: 'NES-CER-005', name: 'Nestlé Cerelac Fortified Baby Cereal Wheat & Apple (Case of 18)', category: 'Nutrition & Baby Foods', description: 'Iron-fortified complementary baby food with goodness of cereal and milk', price: 5400, cost: 3600, currentStock: 310, reorderLevel: 50, supplierId: 's3', status: 'Active', unitsSold: 160 },
  { id: 'p6', sku: 'NES-EVR-006', name: 'Nestlé Everyday Dairy Whitener (1kg Pouch - Box of 12)', category: 'Dairy & Milk Powders', description: 'Specially created to enhance taste of tea with thick, creamy dairy solids', price: 5160, cost: 3500, currentStock: 540, reorderLevel: 90, supplierId: 's1', status: 'Active', unitsSold: 320 },
  { id: 'p7', sku: 'NES-TEA-007', name: 'Nestea Lemon Instant Iced Tea Mix (Pouch 1kg - Box of 10)', category: 'Beverages & Tea', description: 'Refreshing iced tea beverage mix with natural lemon flavour, institutional case', price: 3600, cost: 2300, currentStock: 420, reorderLevel: 70, supplierId: 's2', status: 'Active', unitsSold: 190 },
];

// ─── Sales Orders ─────────────────────────────────────────────────────────────

export const salesOrders: SalesOrder[] = [
  {
    id: 'ORD-1048', customerId: 'c1',
    items: [{ productId: 'p1', quantity: 200, unitPrice: 1440, discount: 5 }, { productId: 'p2', quantity: 15, unitPrice: 13200, discount: 5 }],
    subtotal: 486000, tax: 24300, discount: 24300, total: 486000,
    orderDate: '2025-08-28', salesperson: 'Rahul Sharma',
    billingAddress: 'Reliance Corporate Park, Thane-Belapur Road, Navi Mumbai 400701',
    shippingAddress: 'Reliance Retail Central Logistics Park, Bhiwandi, MH 421302',
    paymentStatus: 'Paid', fulfillmentStatus: 'Delivered', invoiceId: 'INV-2048', notes: 'Scheduled weekly replenishment delivery for Western Hypermarket stores.',
  },
  {
    id: 'ORD-1049', customerId: 'c2',
    items: [{ productId: 'p3', quantity: 150, unitPrice: 1920, discount: 8 }, { productId: 'p4', quantity: 60, unitPrice: 3840, discount: 5 }],
    subtotal: 518400, tax: 25920, discount: 34560, total: 509760,
    orderDate: '2025-09-01', salesperson: 'Rahul Sharma',
    billingAddress: 'B-72, Wagle Industrial Estate, Road No. 33, Thane 400604',
    shippingAddress: 'DMart Regional Distribution Center, Kalamboli, Navi Mumbai 410218',
    paymentStatus: 'Pending', fulfillmentStatus: 'Processing', invoiceId: 'INV-2049', notes: 'Priority delivery ahead of Ganesh Chaturthi festive surge.',
  },
  {
    id: 'ORD-1050', customerId: 'c4',
    items: [{ productId: 'p1', quantity: 350, unitPrice: 1440, discount: 10 }, { productId: 'p6', quantity: 40, unitPrice: 5160, discount: 8 }],
    subtotal: 710400, tax: 35520, discount: 66912, total: 679008,
    orderDate: '2025-09-02', salesperson: 'Priya Shah',
    billingAddress: '26/3, Industrial Suburb, Yeshwantpur, Bangalore 560022',
    shippingAddress: 'Metro Cash & Carry Wholesale Hub, Whitefield, Bangalore 560066',
    paymentStatus: 'Paid', fulfillmentStatus: 'Confirmed', invoiceId: 'INV-2050', notes: 'B2B institutional bulk pallet dispatch.',
  },
  {
    id: 'ORD-1047', customerId: 'c5',
    items: [{ productId: 'p2', quantity: 25, unitPrice: 13200, discount: 10 }, { productId: 'p7', quantity: 50, unitPrice: 3600, discount: 10 }],
    subtotal: 510000, tax: 25500, discount: 51000, total: 484500,
    orderDate: '2025-08-15', salesperson: 'Rahul Sharma',
    billingAddress: '15, Okhla Industrial Area Phase III, New Delhi 110020',
    shippingAddress: 'Swiggy Instamart North Hub, Kundli, Sonipat, HR 131028',
    paymentStatus: 'Pending', fulfillmentStatus: 'Shipped', invoiceId: 'INV-2047', notes: 'Dark store instant inventory stock transfer.',
  },
  {
    id: 'ORD-1046', customerId: 'c6',
    items: [{ productId: 'p2', quantity: 30, unitPrice: 13200, discount: 8 }, { productId: 'p4', quantity: 40, unitPrice: 3840, discount: 5 }],
    subtotal: 549600, tax: 27480, discount: 39360, total: 537720,
    orderDate: '2025-08-30', salesperson: 'Rahul Sharma',
    billingAddress: 'Level 8, HITEC City, Madhapur, Hyderabad 500081',
    shippingAddress: 'Cafe Coffee Day Commissary Hub, Hosur Road, Bangalore 560068',
    paymentStatus: 'Paid', fulfillmentStatus: 'Delivered', invoiceId: 'INV-2046', notes: 'Institutional HoReCa master monthly contract.',
  },
];

// ─── Quotations ───────────────────────────────────────────────────────────────

export const quotations: Quotation[] = [
  {
    id: 'QT-1085', customerId: 'c1', leadId: undefined,
    items: [
      { productId: 'p1', quantity: 300, unitPrice: 1440, discount: 8 },
      { productId: 'p2', quantity: 20, unitPrice: 13200, discount: 5 }
    ],
    total: 661248, createdDate: '2025-09-02', expiryDate: '2025-10-02',
    salesperson: 'Rahul Sharma', status: 'Draft', notes: 'Q4 Modern Trade master agreement for Reliance Retail stores.',
  },
  {
    id: 'QT-1084', customerId: 'c2', leadId: undefined,
    items: [
      { productId: 'p3', quantity: 200, unitPrice: 1920, discount: 10 },
      { productId: 'p4', quantity: 80, unitPrice: 3840, discount: 5 }
    ],
    total: 638208, createdDate: '2025-08-28', expiryDate: '2025-09-28',
    salesperson: 'Priya Shah', status: 'Viewed', notes: 'Under commercial evaluation by DMart central FMCG purchasing team.',
  },
  {
    id: 'QT-1083', leadId: 'l3', customerId: undefined,
    items: [
      { productId: 'p4', quantity: 500, unitPrice: 3840, discount: 12 },
      { productId: 'p6', quantity: 100, unitPrice: 5160, discount: 10 }
    ],
    total: 2154240, createdDate: '2025-08-25', expiryDate: '2025-09-25',
    salesperson: 'Rahul Sharma', status: 'Sent', notes: 'Bulk festive order of Nestlé Milkmaid condensed milk for sweet making.',
  },
  {
    id: 'QT-1082', leadId: 'l1', customerId: undefined,
    items: [
      { productId: 'p1', quantity: 400, unitPrice: 1440, discount: 10 },
      { productId: 'p3', quantity: 150, unitPrice: 1920, discount: 8 }
    ],
    total: 783744, createdDate: '2025-08-10', expiryDate: '2025-09-10',
    salesperson: 'Priya Shah', status: 'Viewed', notes: 'Zepto Dark Store expansion quote for 18 regional micro-hubs.',
  },
  {
    id: 'QT-1081', customerId: 'c4', leadId: undefined,
    items: [
      { productId: 'p1', quantity: 500, unitPrice: 1440, discount: 12 },
      { productId: 'p2', quantity: 30, unitPrice: 13200, discount: 8 }
    ],
    total: 998016, createdDate: '2025-08-18', expiryDate: '2025-09-18',
    salesperson: 'Priya Shah', status: 'Accepted', notes: 'Approved by Metro Wholesale category manager. Ready for invoicing.',
  },
  {
    id: 'QT-1080', leadId: undefined, customerId: 'c3',
    items: [
      { productId: 'p3', quantity: 100, unitPrice: 1920, discount: 5 }
    ],
    total: 182400, createdDate: '2025-08-20', expiryDate: '2025-09-20',
    salesperson: 'Priya Shah', status: 'Accepted', notes: 'KitKat flash sale replenishment for Blinkit Gurgaon dark stores.',
  },
  {
    id: 'QT-1079', leadId: undefined, customerId: 'c7',
    items: [
      { productId: 'p5', quantity: 50, unitPrice: 5400, discount: 5 }
    ],
    total: 256500, createdDate: '2025-07-01', expiryDate: '2025-08-01',
    salesperson: 'Priya Shah', status: 'Expired', notes: 'Expired quotation for Cerelac seasonal buffer stock.',
  },
  {
    id: 'QT-1078', customerId: 'c5', leadId: undefined,
    items: [
      { productId: 'p2', quantity: 40, unitPrice: 13200, discount: 15 }
    ],
    total: 448800, createdDate: '2025-07-15', expiryDate: '2025-08-15',
    salesperson: 'Rahul Sharma', status: 'Rejected', notes: 'Client requested higher distributor margins on Nescafé glass jars.',
  },
  {
    id: 'QT-1077', leadId: 'l2', customerId: undefined,
    items: [
      { productId: 'p2', quantity: 25, unitPrice: 13200, discount: 8 },
      { productId: 'p7', quantity: 30, unitPrice: 3600, discount: 8 }
    ],
    total: 403104, createdDate: '2025-08-05', expiryDate: '2025-09-05',
    salesperson: 'Priya Shah', status: 'Sent', notes: 'Taj Hotels beverage tasting proposal.',
  },
  {
    id: 'QT-1076', customerId: 'c6', leadId: undefined,
    items: [
      { productId: 'p6', quantity: 60, unitPrice: 5160, discount: 10 }
    ],
    total: 278640, createdDate: '2025-08-12', expiryDate: '2025-09-12',
    salesperson: 'Rahul Sharma', status: 'Accepted', notes: 'Everyday Dairy Whitener vending supply contract signed.',
  },
];

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const invoices: Invoice[] = [
  { id: 'INV-2048', orderId: 'ORD-1048', customerId: 'c1', amount: 486000, issueDate: '2025-08-28', dueDate: '2025-09-27', status: 'Paid', items: [] },
  { id: 'INV-2049', orderId: 'ORD-1049', customerId: 'c2', amount: 509760, issueDate: '2025-09-01', dueDate: '2025-10-01', status: 'Sent', items: [] },
  { id: 'INV-2050', orderId: 'ORD-1050', customerId: 'c4', amount: 679008, issueDate: '2025-09-02', dueDate: '2025-10-02', status: 'Paid', items: [] },
  { id: 'INV-2047', orderId: 'ORD-1047', customerId: 'c5', amount: 484500, issueDate: '2025-08-15', dueDate: '2025-09-15', status: 'Overdue', items: [] },
  { id: 'INV-2046', orderId: 'ORD-1046', customerId: 'c6', amount: 537720, issueDate: '2025-08-30', dueDate: '2025-09-29', status: 'Paid', items: [] },
  { id: 'INV-2044', orderId: 'ORD-1044', customerId: 'c3', amount: 182400, issueDate: '2025-08-10', dueDate: '2025-09-09', status: 'Overdue', items: [] },
  { id: 'INV-2043', orderId: 'ORD-1043', customerId: 'c7', amount: 125000, issueDate: '2025-07-10', dueDate: '2025-08-09', status: 'Overdue', items: [] },
];

// ─── Payments ─────────────────────────────────────────────────────────────────

export const payments: Payment[] = [
  { id: 'PAY-0091', customerId: 'c4', invoiceId: 'INV-2050', amount: 679008, method: 'Bank Transfer', date: '2025-09-02', reference: 'NEFT/2025/09/4521', status: 'Completed' },
  { id: 'PAY-0090', customerId: 'c6', invoiceId: 'INV-2046', amount: 537720, method: 'UPI', date: '2025-08-31', reference: 'UPI/REF/8821', status: 'Completed' },
  { id: 'PAY-0089', customerId: 'c1', invoiceId: 'INV-2048', amount: 486000, method: 'Bank Transfer', date: '2025-09-01', reference: 'RTGS/2025/09/1122', status: 'Completed' },
  { id: 'PAY-0088', customerId: 'c2', invoiceId: 'INV-2042', amount: 350000, method: 'Bank Transfer', date: '2025-08-25', reference: 'NEFT/2025/08/7731', status: 'Completed' },
];

// ─── Expenses ─────────────────────────────────────────────────────────────────

export const expenses: Expense[] = [
  { id: 'EXP-0201', category: 'Marketing', description: 'Monsoon Maggi & Tea Retail POP Ad Displays', amount: 145000, date: '2025-09-01', department: 'Marketing', submittedBy: 'Kavya Nair', status: 'Approved' },
  { id: 'EXP-0200', category: 'Operations', description: 'Refrigerated Cold Chain Reefer Logistics', amount: 84000, date: '2025-08-28', department: 'Operations', submittedBy: 'Vikram Rao', status: 'Approved' },
  { id: 'EXP-0199', category: 'Procurement', description: 'FSSAI Statutory Lab Testing & Batch Quality QA', amount: 62000, date: '2025-08-20', department: 'QA & Compliance', submittedBy: 'Sanjay Kumar', status: 'Approved' },
  { id: 'EXP-0198', category: 'Utilities', description: 'Gurugram HQ & Cold Warehouse Electricity', amount: 48500, date: '2025-08-01', department: 'Admin', submittedBy: 'Admin Team', status: 'Approved' },
  { id: 'EXP-0197', category: 'Marketing', description: 'Modern Trade Endcap Branding at Reliance & DMart', amount: 112000, date: '2025-07-25', department: 'Marketing', submittedBy: 'Kavya Nair', status: 'Approved' },
  { id: 'EXP-0196', category: 'Travel', description: 'National Sales Key Account Modern Trade Tour', amount: 38000, date: '2025-08-15', department: 'Sales', submittedBy: 'Rahul Sharma', status: 'Pending' },
];

// ─── Suppliers ────────────────────────────────────────────────────────────────

export const suppliers: Supplier[] = [
  { id: 's1', name: 'National Dairy Cooperatives & Milk Union', contactPerson: 'Dr. Verghese Patel', email: 'procurement@dairy-coop.in', phone: '+91 98112 34567', category: 'Dairy Solids & Milk Sourcing', products: ['Nestlé Milkmaid Sweetened Condensed Milk', 'Nestlé Everyday Dairy Whitener', 'KitKat Milk Chocolate Wafer'], totalOrders: 54, totalPurchase: 4840000, outstanding: 220000, rating: 4.9, status: 'Active', leadTime: 4 },
  { id: 's2', name: 'Karnataka Planters Green Coffee Estate', contactPerson: 'Ramesh Gowda', email: 'estate@coffeegrowers.in', phone: '+91 97223 45678', category: 'Raw Coffee Beans & Tea Extracts', products: ['Nescafé Classic Instant Coffee', 'Nestea Lemon Instant Iced Tea Mix'], totalOrders: 38, totalPurchase: 3660000, outstanding: 0, rating: 4.8, status: 'Active', leadTime: 6 },
  { id: 's3', name: 'Punjab Golden Wheat Agro Flour Mills', contactPerson: 'Harpreet Singh', email: 'sales@goldenwheat.in', phone: '+91 96334 56789', category: 'Wheat Flour & Cereal Grains', products: ['Maggi 2-Minute Masala Noodles', 'Nestlé Cerelac Fortified Baby Cereal'], totalOrders: 42, totalPurchase: 2980000, outstanding: 145000, rating: 4.7, status: 'Active', leadTime: 5 },
  { id: 's4', name: 'Huhtamaki & TetraPak Packaging Systems', contactPerson: 'Sunita Kapoor', email: 'orders@asepticpack.in', phone: '+91 95445 67890', category: 'Food-Grade Cartons, Foils & Tins', products: ['Corrugated Shipping Cartons', 'Aseptic Barrier Pouches', 'Tinplate Cans'], totalOrders: 31, totalPurchase: 1840000, outstanding: 85000, rating: 4.6, status: 'Active', leadTime: 7 },
];

// ─── Purchase Orders ──────────────────────────────────────────────────────────

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-0481', supplierId: 's2', items: [{ productId: 'p2', quantity: 50, unitCost: 8400 }], total: 420000, orderDate: '2025-08-25', expectedDate: '2025-09-01', status: 'Received' },
  { id: 'PO-0482', supplierId: 's3', items: [{ productId: 'p1', quantity: 300, unitCost: 960 }], total: 288000, orderDate: '2025-09-01', expectedDate: '2025-09-15', status: 'Confirmed' },
  { id: 'PO-0483', supplierId: 's1', items: [{ productId: 'p4', quantity: 120, unitCost: 2600 }], total: 312000, orderDate: '2025-09-03', expectedDate: '2025-09-10', status: 'Sent' },
  { id: 'PO-0480', supplierId: 's1', items: [{ productId: 'p6', quantity: 150, unitCost: 3500 }], total: 525000, orderDate: '2025-08-10', expectedDate: '2025-08-20', status: 'Received' },
];

// ─── Campaigns ────────────────────────────────────────────────────────────────

export const campaigns: Campaign[] = [
  { id: 'camp1', name: 'Monsoon Maggi & Tea Retail Blitz', platform: 'Multi-platform', startDate: '2025-07-01', endDate: '2025-09-30', reach: 384000, engagement: 29840, leads: 246, conversions: 38, revenue: 3240000, roi: 5.8, status: 'Active', budget: 280000, spend: 212000 },
  { id: 'camp2', name: 'Nescafé Cold Coffee Youth Drive', platform: 'Instagram', startDate: '2025-07-15', endDate: '2025-09-15', reach: 245000, engagement: 18420, leads: 186, conversions: 24, revenue: 1840000, roi: 4.6, status: 'Active', budget: 180000, spend: 148000 },
  { id: 'camp3', name: 'B2B Modern Trade Wholesale Push', platform: 'LinkedIn', startDate: '2025-06-01', endDate: '2025-08-31', reach: 82600, engagement: 6180, leads: 94, conversions: 14, revenue: 2920000, roi: 8.2, status: 'Completed', budget: 200000, spend: 186000 },
  { id: 'camp4', name: 'Quick Commerce Instant Grocery Push', platform: 'Facebook', startDate: '2025-08-01', endDate: '2025-10-31', reach: 162000, engagement: 12820, leads: 158, conversions: 18, revenue: 1420000, roi: 3.8, status: 'Active', budget: 190000, spend: 98000 },
];

// ─── Social Posts ─────────────────────────────────────────────────────────────

export const socialPosts: SocialPost[] = [
  { id: 'sp1', title: '2-Minute Happiness: Fueling Monsoon Memories', platform: 'Instagram', content: 'Rains, friends, and steaming bowls of Maggi! Keep your store shelves stocked with the all-time favorite snack. Order master cartons directly on the Nestlé B2B portal. 🍜💛', status: 'Published', publishDate: '2025-08-20', reach: 142800, likes: 6842, comments: 884, shares: 1412, clicks: 8840, enquiries: 384, leadsGenerated: 186, qualifiedLeads: 88, conversions: 28, revenueAttributed: 1840000, campaignId: 'camp2' },
  { id: 'sp2', title: 'Start Fresh with Nescafé Classic Instant Coffee', platform: 'LinkedIn', content: 'Over 80% of India’s corporate offices start their mornings with Nescafé. Learn how Nestlé Foodservice solutions power executive vending across Tier 1 campuses.', status: 'Published', publishDate: '2025-07-15', reach: 48400, likes: 1642, comments: 328, shares: 184, clicks: 3420, enquiries: 196, leadsGenerated: 94, qualifiedLeads: 58, conversions: 14, revenueAttributed: 1920000, campaignId: 'camp3' },
  { id: 'sp3', title: 'KitKat Break Time Festival Offer', platform: 'Facebook', content: 'Have a break, have a KitKat! Stock up your supermarket confectionery displays ahead of the festive season with exclusive wholesale bulk trade margins.', status: 'Scheduled', publishDate: '2025-09-10', reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0, enquiries: 0, leadsGenerated: 0, qualifiedLeads: 0, conversions: 0, revenueAttributed: 0, campaignId: 'camp4' },
  { id: 'sp4', title: 'Pure Culinary Magic with Nestlé Milkmaid', platform: 'Instagram', content: 'From creamy kheer to celebration cakes, Milkmaid brings festive desserts to life. Bulk trays now available with fast 24-hour dispatch for bakeries and sweet makers. ✨', status: 'Draft', publishDate: '', reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0, enquiries: 0, leadsGenerated: 0, qualifiedLeads: 0, conversions: 0, revenueAttributed: 0, campaignId: 'camp1' },
];

// ─── Documents ────────────────────────────────────────────────────────────────

export const documents: Document[] = [
  { id: 'd1', name: 'FSSAI Central Food Safety Audit Report 2025.pdf', category: 'Report', size: '3.4 MB', uploadedBy: 'Aisha Khan', uploadedDate: '2025-07-05', status: 'Indexed', linkedTo: '' },
  { id: 'd2', name: 'Reliance Retail Master Supply Agreement.pdf', category: 'Contract', size: '2.8 MB', uploadedBy: 'Suresh Narayanan', uploadedDate: '2025-03-20', status: 'Indexed', linkedTo: 'c1' },
  { id: 'd3', name: 'INV-2048 FMCG Dispatch Invoice.pdf', category: 'Invoice', size: '0.4 MB', uploadedBy: 'Neha Patel', uploadedDate: '2025-08-28', status: 'Indexed', linkedTo: 'INV-2048' },
  { id: 'd4', name: 'QT-1083 Haldiram Bulk Milkmaid Quotation.pdf', category: 'Quotation', size: '0.6 MB', uploadedBy: 'Rahul Sharma', uploadedDate: '2025-07-25', status: 'Indexed', linkedTo: 'QT-1083' },
  { id: 'd5', name: 'National Dairy Union Procurement Agreement.pdf', category: 'Contract', size: '3.1 MB', uploadedBy: 'Sanjay Kumar', uploadedDate: '2025-01-15', status: 'Indexed', linkedTo: 's1' },
  { id: 'd6', name: 'Q2 Modern Trade Revenue & Margins Summary.pdf', category: 'Report', size: '1.9 MB', uploadedBy: 'Neha Patel', uploadedDate: '2025-07-20', status: 'Indexed', linkedTo: '' },
  { id: 'd7', name: 'PO-0483 Condensed Milk Purchase Order.pdf', category: 'Purchase Order', size: '0.3 MB', uploadedBy: 'Sanjay Kumar', uploadedDate: '2025-09-03', status: 'Processing', linkedTo: 'PO-0483' },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications: Notification[] = [
  { id: 'n1', type: 'lead', title: 'New quick-commerce grocery lead', message: 'Zepto Quick Grocery Hubs has submitted a master tender for Maggi & Nescafé lines. Projected: ₹14.8L', time: '10 min ago', read: false },
  { id: 'n2', type: 'stock', title: 'Cold-chain inventory alert', message: 'Nestlé Cerelac Wheat & Apple inventory is at 310 cases (reorder threshold 50).', time: '1 hour ago', read: false },
  { id: 'n3', type: 'invoice', title: 'Modern trade invoice payment cleared', message: 'Reliance Retail cleared ₹4.84L via RTGS for ORD-1048.', time: '2 hours ago', read: false },
  { id: 'n4', type: 'campaign', title: 'Monsoon campaign milestone', message: 'Monsoon Maggi & Tea Retail Blitz reached 3.84L retail store managers.', time: '4 hours ago', read: true },
  { id: 'n5', type: 'quotation', title: 'HoReCa quotation accepted', message: 'QT-1080 for Chaayos Institutional Supply accepted. Dispatch pending.', time: '1 day ago', read: true },
  { id: 'n6', type: 'order', title: 'Wholesale order delivered', message: 'ORD-1046 (KitKat & Nescafé) delivered to Avenue Supermarts (DMart).', time: '1 day ago', read: true },
];

// ─── Revenue trend (6 months) ─────────────────────────────────────────────────

export const revenueTrend = [
  { month: 'Apr', revenue: 3840000, expenses: 1980000, profit: 1860000 },
  { month: 'May', revenue: 4120000, expenses: 2080000, profit: 2040000 },
  { month: 'Jun', revenue: 4480000, expenses: 2240000, profit: 2240000 },
  { month: 'Jul', revenue: 4280000, expenses: 2180000, profit: 2100000 },
  { month: 'Aug', revenue: 4840000, expenses: 2320000, profit: 2520000 },
  { month: 'Sep', revenue: 5320000, expenses: 2460000, profit: 2860000 },
];

export const leadTrend = [
  { month: 'Apr', new: 48, qualified: 28, converted: 12 },
  { month: 'May', new: 54, qualified: 32, converted: 16 },
  { month: 'Jun', new: 62, qualified: 38, converted: 19 },
  { month: 'Jul', new: 58, qualified: 35, converted: 18 },
  { month: 'Aug', new: 72, qualified: 44, converted: 24 },
  { month: 'Sep', new: 68, qualified: 42, converted: 22 },
];

export const leadsBySource = [
  { source: 'Website', value: 186, color: '#2563EB' },
  { source: 'Sales Team', value: 148, color: '#16A34A' },
  { source: 'LinkedIn', value: 94, color: '#0A66C2' },
  { source: 'Instagram', value: 84, color: '#E1306C' },
  { source: 'Events & Expos', value: 58, color: '#F59E0B' },
  { source: 'Referral', value: 42, color: '#7C3AED' },
  { source: 'Facebook', value: 38, color: '#1877F2' },
  { source: 'Other', value: 24, color: '#94A3B8' },
];

export const salesByRegion = [
  { region: 'Maharashtra', value: 4840000 },
  { region: 'Delhi NCR', value: 3680000 },
  { region: 'Karnataka', value: 2920000 },
  { region: 'Tamil Nadu', value: 2240000 },
  { region: 'Gujarat', value: 1860000 },
  { region: 'West Bengal', value: 1420000 },
];

export const revenueByCategory = [
  { name: 'Instant Foods (Maggi)', value: 5820000, color: '#D97706' },
  { name: 'Coffee & Beverages (Nescafé)', value: 4340000, color: '#92400E' },
  { name: 'Dairy & Culinary (Milkmaid/Everyday)', value: 3680000, color: '#2563EB' },
  { name: 'Confectionery (KitKat)', value: 3150000, color: '#DC2626' },
  { name: 'Nutrition (Cerelac)', value: 2260000, color: '#16A34A' },
];

export const conversionFunnel = [
  { stage: 'New', count: 242, pct: 100 },
  { stage: 'Contacted', count: 184, pct: 76 },
  { stage: 'Qualified', count: 126, pct: 52 },
  { stage: 'Proposal', count: 88, pct: 36 },
  { stage: 'Negotiation', count: 52, pct: 21 },
  { stage: 'Won', count: 38, pct: 16 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const formatCurrency = (value: number) =>
  value >= 100000
    ? `₹${(value / 100000).toFixed(1)}L`
    : `₹${value.toLocaleString('en-IN')}`;

export const getCustomerById = (id: string) => customers.find(c => c.id === id);
export const getProductById = (id: string) => products.find(p => p.id === id);
export const getSupplierById = (id: string) => suppliers.find(s => s.id === id);
export const getLeadById = (id: string) => leads.find(l => l.id === id);
