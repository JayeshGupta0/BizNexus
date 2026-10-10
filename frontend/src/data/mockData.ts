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
  email: string;
  role: Role;
  avatar: string;
  department: string;
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
  method: 'Bank Transfer' | 'UPI' | 'Card' | 'Cash' | 'Other';
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
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: { productId: string; quantity: number; unitCost: number }[];
  total: number;
  orderDate: string;
  expectedDate: string;
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Received' | 'Cancelled';
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
  { id: 'u1', name: 'Arjun Mehta', email: 'arjun@biznexuz.com', role: 'Business Owner', avatar: 'AM', department: 'Executive' },
  { id: 'u2', name: 'Rahul Sharma', email: 'rahul@biznexuz.com', role: 'Sales Manager', avatar: 'RS', department: 'Sales' },
  { id: 'u3', name: 'Priya Shah', email: 'priya@biznexuz.com', role: 'Sales Executive', avatar: 'PS', department: 'Sales' },
  { id: 'u4', name: 'Kavya Nair', email: 'kavya@biznexuz.com', role: 'Marketing Manager', avatar: 'KN', department: 'Marketing' },
  { id: 'u5', name: 'Vikram Rao', email: 'vikram@biznexuz.com', role: 'Inventory Manager', avatar: 'VR', department: 'Operations' },
  { id: 'u6', name: 'Sanjay Kumar', email: 'sanjay@biznexuz.com', role: 'Purchase Manager', avatar: 'SK', department: 'Procurement' },
  { id: 'u7', name: 'Neha Patel', email: 'neha@biznexuz.com', role: 'Finance Manager', avatar: 'NP', department: 'Finance' },
  { id: 'u8', name: 'Aisha Khan', email: 'aisha@biznexuz.com', role: 'Business Analyst', avatar: 'AK', department: 'Analytics' },
];

// ─── Customers ────────────────────────────────────────────────────────────────

export const customers: Customer[] = [
  {
    id: 'c1', businessName: 'Acme Corporation', customerType: 'Distributor',
    contactPerson: 'Suresh Menon', email: 'suresh@acme.in', phone: '+91 98765 43210',
    location: 'Mumbai, MH', industry: 'Technology Distribution', accountOwner: 'Rahul Sharma',
    status: 'Active', totalOrders: 42, totalRevenue: 2840000, avgOrderValue: 67619, outstanding: 184000,
    lastPurchase: '2025-08-28', customerSince: '2022-03-15',
    taxId: 'GSTIN27ABCDE1234F1Z5', website: 'www.acmecorp.in',
    address: '301, Commercial Tower, Bandra Kurla Complex, Mumbai 400051',
    notes: 'Top distributor for Maharashtra and Goa regions.',
  },
  {
    id: 'c2', businessName: 'NovaTech Industries', customerType: 'Enterprise',
    contactPerson: 'Anjali Desai', email: 'anjali@novatech.in', phone: '+91 99887 65432',
    location: 'Bangalore, KA', industry: 'Software & IT', accountOwner: 'Rahul Sharma',
    status: 'Active', totalOrders: 28, totalRevenue: 1920000, avgOrderValue: 68571, outstanding: 96000,
    lastPurchase: '2025-09-01', customerSince: '2021-11-08',
    taxId: 'GSTIN29ABCDE5678G2Z6', website: 'www.novatech.in',
    address: '12th Floor, Tech Park, Whitefield, Bangalore 560066',
    notes: 'Annual enterprise contract. High growth potential.',
  },
  {
    id: 'c3', businessName: 'Orbit Technologies', customerType: 'Business',
    contactPerson: 'Rajan Pillai', email: 'rajan@orbit.in', phone: '+91 97654 32109',
    location: 'Pune, MH', industry: 'Manufacturing', accountOwner: 'Priya Shah',
    status: 'Active', totalOrders: 18, totalRevenue: 860000, avgOrderValue: 47778, outstanding: 42000,
    lastPurchase: '2025-08-20', customerSince: '2023-01-20',
    taxId: 'GSTIN27ORBIT9012H3Z7', website: 'www.orbittec.in',
    address: 'Plot 45, Hinjewadi IT Park, Pune 411057',
    notes: 'Growing account. Interested in analytics modules.',
  },
  {
    id: 'c4', businessName: 'Apex Retail', customerType: 'Retailer',
    contactPerson: 'Meera Iyer', email: 'meera@apexretail.in', phone: '+91 96543 21098',
    location: 'Chennai, TN', industry: 'Retail', accountOwner: 'Priya Shah',
    status: 'Active', totalOrders: 35, totalRevenue: 1240000, avgOrderValue: 35429, outstanding: 62000,
    lastPurchase: '2025-09-02', customerSince: '2022-07-12',
    taxId: 'GSTIN33APEX3456I4Z8', website: 'www.apexretail.in',
    address: '78, Anna Salai, Chennai 600002',
    notes: 'High volume, multiple retail locations.',
  },
  {
    id: 'c5', businessName: 'Vertex Solutions', customerType: 'Wholesaler',
    contactPerson: 'Deepak Joshi', email: 'deepak@vertex.in', phone: '+91 95432 10987',
    location: 'Delhi, DL', industry: 'Wholesale Distribution', accountOwner: 'Rahul Sharma',
    status: 'Active', totalOrders: 22, totalRevenue: 1680000, avgOrderValue: 76364, outstanding: 220000,
    lastPurchase: '2025-08-15', customerSince: '2022-05-03',
    taxId: 'GSTIN07VRTX7890J5Z9', website: 'www.vertexsol.in',
    address: '15, Nehru Place, New Delhi 110019',
    notes: 'North India wholesale partner. Payment delays noted.',
  },
  {
    id: 'c6', businessName: 'CloudPeak Labs', customerType: 'Enterprise',
    contactPerson: 'Shruti Banerjee', email: 'shruti@cloudpeak.in', phone: '+91 94321 09876',
    location: 'Hyderabad, TS', industry: 'Cloud Services', accountOwner: 'Rahul Sharma',
    status: 'Active', totalOrders: 15, totalRevenue: 1120000, avgOrderValue: 74667, outstanding: 0,
    lastPurchase: '2025-08-30', customerSince: '2023-06-10',
    taxId: 'GSTIN36CLPK2345K6Z0', website: 'www.cloudpeak.io',
    address: 'Level 8, HITEC City, Hyderabad 500081',
    notes: 'Excellent payment track record. Exploring AI suite.',
  },
  {
    id: 'c7', businessName: 'Greenfield Co.', customerType: 'Business',
    contactPerson: 'Arun Krishnan', email: 'arun@greenfield.in', phone: '+91 93210 98765',
    location: 'Kochi, KL', industry: 'Agriculture & Food', accountOwner: 'Priya Shah',
    status: 'At Risk', totalOrders: 8, totalRevenue: 320000, avgOrderValue: 40000, outstanding: 95000,
    lastPurchase: '2025-07-10', customerSince: '2024-02-28',
    taxId: 'GSTIN32GFLD6789L7Z1', website: 'www.greenfieldco.in',
    address: '22, MG Road, Kochi 682016',
    notes: 'Irregular purchase pattern. Follow up on outstanding balance.',
  },
];

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leads: Lead[] = [
  {
    id: 'l1', companyName: 'Acme Retail Prospect', contactPerson: 'Vivek Kapoor',
    email: 'vivek@acmeretail.com', phone: '+91 98001 23456', location: 'Jaipur, RJ',
    industry: 'Retail', leadType: 'Retailer', source: 'Website', stage: 'Proposal',
    potentialValue: 480000, probability: 65, priority: 'High', assignedTo: 'Priya Shah',
    createdDate: '2025-07-15', lastActivity: '2025-09-01', nextFollowUp: '2025-09-05',
    expectedClose: '2025-09-30', campaignId: 'camp1', notes: 'Interested in CRM + Analytics package.',
    activities: [
      { id: 'a1', type: 'system', title: 'Lead created from Website', description: 'Prospect filled contact form on website.', date: '2025-07-15', user: 'System' },
      { id: 'a2', type: 'call', title: 'Initial discovery call', description: '30-min call. Strong interest in CRM suite.', date: '2025-07-20', user: 'Priya Shah' },
      { id: 'a3', type: 'email', title: 'Product brochure sent', description: 'Sent product catalog and pricing sheet.', date: '2025-07-25', user: 'Priya Shah' },
      { id: 'a4', type: 'quote', title: 'Quotation sent', description: 'QT-1082 sent for Enterprise CRM + Analytics.', date: '2025-08-10', user: 'Priya Shah' },
      { id: 'a5', type: 'email', title: 'Follow-up email', description: 'Prospect viewed quotation. Requested revised pricing.', date: '2025-09-01', user: 'Priya Shah' },
    ],
  },
  {
    id: 'l2', companyName: 'ABC Wholesale', contactPerson: 'Mohan Lal',
    email: 'mohan@abcwholesale.com', phone: '+91 97002 34567', location: 'Surat, GJ',
    industry: 'Wholesale Distribution', leadType: 'Wholesaler', source: 'Instagram', stage: 'Qualified',
    potentialValue: 840000, probability: 50, priority: 'High', assignedTo: 'Priya Shah',
    createdDate: '2025-08-01', lastActivity: '2025-08-28', nextFollowUp: '2025-09-06',
    expectedClose: '2025-10-15', campaignId: 'camp2', notes: 'Generated from Wholesale Partner Campaign.',
    activities: [
      { id: 'a6', type: 'system', title: 'Lead created from Instagram campaign', description: 'Prospect clicked ad from Wholesale Partner Campaign.', date: '2025-08-01', user: 'System' },
      { id: 'a7', type: 'call', title: 'Qualification call', description: 'Confirmed budget. Evaluating 3 vendors.', date: '2025-08-15', user: 'Rahul Sharma' },
      { id: 'a8', type: 'meeting', title: 'Online demo scheduled', description: 'Product walkthrough demo scheduled.', date: '2025-08-28', user: 'Priya Shah' },
    ],
  },
  {
    id: 'l3', companyName: 'Nova Distributor', contactPerson: 'Sunita Rao',
    email: 'sunita@novadist.com', phone: '+91 96003 45678', location: 'Hyderabad, TS',
    industry: 'FMCG Distribution', leadType: 'Distributor', source: 'LinkedIn', stage: 'Negotiation',
    potentialValue: 1200000, probability: 75, priority: 'High', assignedTo: 'Rahul Sharma',
    createdDate: '2025-06-20', lastActivity: '2025-09-02', nextFollowUp: '2025-09-04',
    expectedClose: '2025-09-20', campaignId: 'camp3', notes: 'High-value distributor. Near closing.',
    activities: [
      { id: 'a9', type: 'system', title: 'Lead created from LinkedIn campaign', description: 'Inbound enquiry from LinkedIn B2B campaign.', date: '2025-06-20', user: 'System' },
      { id: 'a10', type: 'meeting', title: 'In-person meeting at HQ', description: 'Presented full platform demo. Very positive reception.', date: '2025-07-10', user: 'Rahul Sharma' },
      { id: 'a11', type: 'quote', title: 'Custom proposal sent', description: 'Custom ERP + CRM + AI package proposal submitted.', date: '2025-07-25', user: 'Rahul Sharma' },
      { id: 'a12', type: 'call', title: 'Pricing negotiation call', description: 'Requesting 12% volume discount. Under review.', date: '2025-09-02', user: 'Rahul Sharma' },
    ],
  },
  {
    id: 'l4', companyName: 'Brightline Systems', contactPerson: 'Pooja Iyer',
    email: 'pooja@brightline.in', phone: '+91 95004 56789', location: 'Bengaluru, KA',
    industry: 'IT Services', leadType: 'Business', source: 'Referral', stage: 'Contacted',
    potentialValue: 360000, probability: 30, priority: 'Medium', assignedTo: 'Priya Shah',
    createdDate: '2025-08-18', lastActivity: '2025-08-22', nextFollowUp: '2025-09-08',
    expectedClose: '2025-11-01', campaignId: undefined, notes: 'Referred by Acme Corporation.',
    activities: [
      { id: 'a13', type: 'system', title: 'Lead created via referral', description: 'Referred by Suresh Menon (Acme Corporation).', date: '2025-08-18', user: 'System' },
      { id: 'a14', type: 'email', title: 'Introduction email sent', description: 'Sent welcome email with product overview.', date: '2025-08-22', user: 'Priya Shah' },
    ],
  },
  {
    id: 'l5', companyName: 'Northstar Retail', contactPerson: 'Amit Sharma',
    email: 'amit@northstar.in', phone: '+91 94005 67890', location: 'Chandigarh, PB',
    industry: 'Retail Chain', leadType: 'Retailer', source: 'Facebook', stage: 'New',
    potentialValue: 520000, probability: 20, priority: 'Medium', assignedTo: 'Priya Shah',
    createdDate: '2025-09-01', lastActivity: '2025-09-01', nextFollowUp: '2025-09-07',
    expectedClose: '2025-11-30', campaignId: 'camp1', notes: 'New inbound from Facebook retail campaign.',
    activities: [
      { id: 'a15', type: 'system', title: 'Lead created from Facebook campaign', description: 'Lead form submission from Retail Growth campaign.', date: '2025-09-01', user: 'System' },
    ],
  },
  {
    id: 'l6', companyName: 'Metro Pharma Group', contactPerson: 'Dr. Karan Malhotra',
    email: 'karan@metropharma.in', phone: '+91 93006 78901', location: 'Mumbai, MH',
    industry: 'Pharmaceutical', leadType: 'Enterprise', source: 'Events', stage: 'Won',
    potentialValue: 1800000, probability: 100, priority: 'High', assignedTo: 'Rahul Sharma',
    createdDate: '2025-04-10', lastActivity: '2025-07-15', nextFollowUp: '',
    expectedClose: '2025-07-15', campaignId: undefined, notes: 'Converted to customer. See Acme Corporation account.',
    activities: [
      { id: 'a16', type: 'system', title: 'Lead created at trade event', description: 'Met at BizTech Expo 2025, Mumbai.', date: '2025-04-10', user: 'System' },
      { id: 'a17', type: 'meeting', title: 'Full platform demo', description: 'C-suite presentation, 2 hours.', date: '2025-05-20', user: 'Arjun Mehta' },
      { id: 'a18', type: 'quote', title: 'Enterprise proposal submitted', description: 'Custom 3-year enterprise agreement submitted.', date: '2025-06-10', user: 'Rahul Sharma' },
      { id: 'a19', type: 'system', title: 'Lead converted to customer', description: 'Agreement signed. Account created.', date: '2025-07-15', user: 'System' },
    ],
  },
  {
    id: 'l7', companyName: 'Sunrise Distributors', contactPerson: 'Farhan Sheikh',
    email: 'farhan@sunrise.in', phone: '+91 92007 89012', location: 'Ahmedabad, GJ',
    industry: 'Distribution', leadType: 'Distributor', source: 'Instagram', stage: 'Lost',
    potentialValue: 640000, probability: 0, priority: 'Low', assignedTo: 'Priya Shah',
    createdDate: '2025-05-01', lastActivity: '2025-07-30', nextFollowUp: '',
    expectedClose: '2025-07-30', campaignId: 'camp2', notes: 'Went with competitor. Price sensitive.',
    activities: [
      { id: 'a20', type: 'system', title: 'Lead created from Instagram', description: 'Lead from Wholesale Partner Campaign.', date: '2025-05-01', user: 'System' },
      { id: 'a21', type: 'system', title: 'Lead marked as Lost', description: 'Prospect chose competitor on price.', date: '2025-07-30', user: 'Priya Shah' },
    ],
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const products: Product[] = [
  { id: 'p1', sku: 'BNX-CRM-001', name: 'Enterprise CRM Suite', category: 'CRM', description: 'Full CRM with lead management, pipeline, and customer analytics', price: 48000, cost: 18000, currentStock: 150, reorderLevel: 30, supplierId: 's1', status: 'Active', unitsSold: 84 },
  { id: 'p2', sku: 'BNX-ANA-002', name: 'Business Analytics Pro', category: 'Analytics', description: 'Advanced BI and business analytics with custom dashboards', price: 36000, cost: 14000, currentStock: 8, reorderLevel: 15, supplierId: 's1', status: 'Low Stock', unitsSold: 62 },
  { id: 'p3', sku: 'BNX-INV-003', name: 'Inventory Management Module', category: 'Operations', description: 'Real-time inventory tracking and purchase management', price: 24000, cost: 9000, currentStock: 0, reorderLevel: 10, supplierId: 's2', status: 'Out of Stock', unitsSold: 45 },
  { id: 'p4', sku: 'BNX-AI-004', name: 'AI Assistant Pro', category: 'AI', description: 'RAG-powered AI assistant for business documents and data', price: 60000, cost: 22000, currentStock: 85, reorderLevel: 20, supplierId: 's1', status: 'Active', unitsSold: 38 },
  { id: 'p5', sku: 'BNX-ERP-005', name: 'Cloud ERP Package', category: 'ERP', description: 'Complete ERP with finance, operations, and procurement', price: 84000, cost: 32000, currentStock: 42, reorderLevel: 10, supplierId: 's3', status: 'Active', unitsSold: 29 },
];

// ─── Sales Orders ─────────────────────────────────────────────────────────────

export const salesOrders: SalesOrder[] = [
  {
    id: 'ORD-1048', customerId: 'c1',
    items: [{ productId: 'p1', quantity: 3, unitPrice: 48000, discount: 5 }, { productId: 'p4', quantity: 1, unitPrice: 60000, discount: 0 }],
    subtotal: 204000, tax: 36720, discount: 7200, total: 233520,
    orderDate: '2025-08-28', salesperson: 'Rahul Sharma',
    billingAddress: '301, Commercial Tower, Bandra Kurla Complex, Mumbai 400051',
    shippingAddress: '301, Commercial Tower, Bandra Kurla Complex, Mumbai 400051',
    paymentStatus: 'Partial', fulfillmentStatus: 'Delivered', invoiceId: 'INV-2048', notes: '',
  },
  {
    id: 'ORD-1049', customerId: 'c2',
    items: [{ productId: 'p5', quantity: 2, unitPrice: 84000, discount: 8 }, { productId: 'p2', quantity: 2, unitPrice: 36000, discount: 5 }],
    subtotal: 240000, tax: 43200, discount: 20400, total: 262800,
    orderDate: '2025-09-01', salesperson: 'Rahul Sharma',
    billingAddress: '12th Floor, Tech Park, Whitefield, Bangalore 560066',
    shippingAddress: '12th Floor, Tech Park, Whitefield, Bangalore 560066',
    paymentStatus: 'Pending', fulfillmentStatus: 'Processing', invoiceId: 'INV-2049', notes: 'Priority delivery requested.',
  },
  {
    id: 'ORD-1050', customerId: 'c4',
    items: [{ productId: 'p1', quantity: 5, unitPrice: 48000, discount: 10 }],
    subtotal: 240000, tax: 43200, discount: 24000, total: 259200,
    orderDate: '2025-09-02', salesperson: 'Priya Shah',
    billingAddress: '78, Anna Salai, Chennai 600002',
    shippingAddress: '78, Anna Salai, Chennai 600002',
    paymentStatus: 'Paid', fulfillmentStatus: 'Confirmed', invoiceId: 'INV-2050', notes: '',
  },
  {
    id: 'ORD-1047', customerId: 'c5',
    items: [{ productId: 'p5', quantity: 3, unitPrice: 84000, discount: 12 }],
    subtotal: 252000, tax: 45360, discount: 30240, total: 267120,
    orderDate: '2025-08-15', salesperson: 'Rahul Sharma',
    billingAddress: '15, Nehru Place, New Delhi 110019',
    shippingAddress: '15, Nehru Place, New Delhi 110019',
    paymentStatus: 'Pending', fulfillmentStatus: 'Shipped', invoiceId: 'INV-2047', notes: 'Volume discount applied.',
  },
  {
    id: 'ORD-1046', customerId: 'c6',
    items: [{ productId: 'p4', quantity: 2, unitPrice: 60000, discount: 0 }, { productId: 'p2', quantity: 1, unitPrice: 36000, discount: 0 }],
    subtotal: 156000, tax: 28080, discount: 0, total: 184080,
    orderDate: '2025-08-30', salesperson: 'Rahul Sharma',
    billingAddress: 'Level 8, HITEC City, Hyderabad 500081',
    shippingAddress: 'Level 8, HITEC City, Hyderabad 500081',
    paymentStatus: 'Paid', fulfillmentStatus: 'Delivered', invoiceId: 'INV-2046', notes: '',
  },
];

// ─── Quotations ───────────────────────────────────────────────────────────────

export const quotations: Quotation[] = [
  {
    id: 'QT-1082', leadId: 'l1', customerId: undefined,
    items: [{ productId: 'p1', quantity: 2, unitPrice: 48000, discount: 5 }, { productId: 'p2', quantity: 1, unitPrice: 36000, discount: 5 }],
    total: 123480, createdDate: '2025-08-10', expiryDate: '2025-09-10',
    salesperson: 'Priya Shah', status: 'Viewed', notes: 'Revised pricing pending.',
  },
  {
    id: 'QT-1083', leadId: 'l3', customerId: undefined,
    items: [{ productId: 'p5', quantity: 2, unitPrice: 84000, discount: 12 }, { productId: 'p4', quantity: 1, unitPrice: 60000, discount: 5 }],
    total: 205920, createdDate: '2025-07-25', expiryDate: '2025-09-25',
    salesperson: 'Rahul Sharma', status: 'Sent', notes: 'Custom enterprise package.',
  },
  {
    id: 'QT-1080', leadId: undefined, customerId: 'c3',
    items: [{ productId: 'p2', quantity: 1, unitPrice: 36000, discount: 0 }],
    total: 36000, createdDate: '2025-08-20', expiryDate: '2025-09-20',
    salesperson: 'Priya Shah', status: 'Accepted', notes: '',
  },
  {
    id: 'QT-1079', leadId: undefined, customerId: 'c7',
    items: [{ productId: 'p1', quantity: 1, unitPrice: 48000, discount: 5 }],
    total: 45600, createdDate: '2025-07-01', expiryDate: '2025-08-01',
    salesperson: 'Priya Shah', status: 'Expired', notes: '',
  },
];

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const invoices: Invoice[] = [
  { id: 'INV-2048', orderId: 'ORD-1048', customerId: 'c1', amount: 233520, issueDate: '2025-08-28', dueDate: '2025-09-27', status: 'Partially Paid', items: [] },
  { id: 'INV-2049', orderId: 'ORD-1049', customerId: 'c2', amount: 262800, issueDate: '2025-09-01', dueDate: '2025-10-01', status: 'Sent', items: [] },
  { id: 'INV-2050', orderId: 'ORD-1050', customerId: 'c4', amount: 259200, issueDate: '2025-09-02', dueDate: '2025-10-02', status: 'Paid', items: [] },
  { id: 'INV-2047', orderId: 'ORD-1047', customerId: 'c5', amount: 267120, issueDate: '2025-08-15', dueDate: '2025-09-15', status: 'Overdue', items: [] },
  { id: 'INV-2046', orderId: 'ORD-1046', customerId: 'c6', amount: 184080, issueDate: '2025-08-30', dueDate: '2025-09-29', status: 'Paid', items: [] },
  { id: 'INV-2044', orderId: 'ORD-1044', customerId: 'c3', amount: 47778, issueDate: '2025-08-10', dueDate: '2025-09-09', status: 'Overdue', items: [] },
  { id: 'INV-2043', orderId: 'ORD-1043', customerId: 'c7', amount: 40000, issueDate: '2025-07-10', dueDate: '2025-08-09', status: 'Overdue', items: [] },
];

// ─── Payments ─────────────────────────────────────────────────────────────────

export const payments: Payment[] = [
  { id: 'PAY-0091', customerId: 'c4', invoiceId: 'INV-2050', amount: 259200, method: 'Bank Transfer', date: '2025-09-02', reference: 'NEFT/2025/09/4521', status: 'Completed' },
  { id: 'PAY-0090', customerId: 'c6', invoiceId: 'INV-2046', amount: 184080, method: 'UPI', date: '2025-08-31', reference: 'UPI/REF/8821', status: 'Completed' },
  { id: 'PAY-0089', customerId: 'c1', invoiceId: 'INV-2048', amount: 49520, method: 'Bank Transfer', date: '2025-09-01', reference: 'RTGS/2025/09/1122', status: 'Completed' },
  { id: 'PAY-0088', customerId: 'c2', invoiceId: 'INV-2042', amount: 180000, method: 'Bank Transfer', date: '2025-08-25', reference: 'NEFT/2025/08/7731', status: 'Completed' },
];

// ─── Expenses ─────────────────────────────────────────────────────────────────

export const expenses: Expense[] = [
  { id: 'EXP-0201', category: 'Marketing', description: 'Q3 Social Media Ad Spend', amount: 85000, date: '2025-09-01', department: 'Marketing', submittedBy: 'Kavya Nair', status: 'Approved' },
  { id: 'EXP-0200', category: 'Travel', description: 'Sales team Mumbai visit', amount: 24000, date: '2025-08-28', department: 'Sales', submittedBy: 'Rahul Sharma', status: 'Approved' },
  { id: 'EXP-0199', category: 'Operations', description: 'Server infrastructure upgrade', amount: 120000, date: '2025-08-20', department: 'IT', submittedBy: 'Arjun Mehta', status: 'Approved' },
  { id: 'EXP-0198', category: 'Utilities', description: 'Office electricity & internet', amount: 18500, date: '2025-08-01', department: 'Admin', submittedBy: 'Admin Team', status: 'Approved' },
  { id: 'EXP-0197', category: 'Marketing', description: 'Print collateral for BizTech Expo', amount: 32000, date: '2025-07-25', department: 'Marketing', submittedBy: 'Kavya Nair', status: 'Approved' },
  { id: 'EXP-0196', category: 'Travel', description: 'Bangalore client meetings', amount: 18000, date: '2025-08-15', department: 'Sales', submittedBy: 'Priya Shah', status: 'Pending' },
];

// ─── Suppliers ────────────────────────────────────────────────────────────────

export const suppliers: Supplier[] = [
  { id: 's1', name: 'TechSource India', contactPerson: 'Nikhil Mehta', email: 'nikhil@techsource.in', phone: '+91 98112 34567', category: 'Software Licensing', products: ['Enterprise CRM Suite', 'Business Analytics Pro', 'AI Assistant Pro'], totalOrders: 24, totalPurchase: 1840000, outstanding: 120000, rating: 4.8, status: 'Active', leadTime: 7 },
  { id: 's2', name: 'Global Components', contactPerson: 'Rekha Das', email: 'rekha@globalcomp.in', phone: '+91 97223 45678', category: 'Hardware & Infrastructure', products: ['Inventory Management Module'], totalOrders: 18, totalPurchase: 960000, outstanding: 0, rating: 4.2, status: 'Active', leadTime: 14 },
  { id: 's3', name: 'Prime Distribution', contactPerson: 'Syed Ali', email: 'syed@primedist.in', phone: '+91 96334 56789', category: 'ERP Solutions', products: ['Cloud ERP Package'], totalOrders: 12, totalPurchase: 1120000, outstanding: 85000, rating: 4.5, status: 'Active', leadTime: 10 },
];

// ─── Purchase Orders ──────────────────────────────────────────────────────────

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-0481', supplierId: 's1', items: [{ productId: 'p2', quantity: 30, unitCost: 14000 }], total: 420000, orderDate: '2025-08-25', expectedDate: '2025-09-01', status: 'Received' },
  { id: 'PO-0482', supplierId: 's2', items: [{ productId: 'p3', quantity: 20, unitCost: 9000 }], total: 180000, orderDate: '2025-09-01', expectedDate: '2025-09-15', status: 'Confirmed' },
  { id: 'PO-0483', supplierId: 's1', items: [{ productId: 'p4', quantity: 25, unitCost: 22000 }], total: 550000, orderDate: '2025-09-03', expectedDate: '2025-09-10', status: 'Sent' },
  { id: 'PO-0480', supplierId: 's3', items: [{ productId: 'p5', quantity: 15, unitCost: 32000 }], total: 480000, orderDate: '2025-08-10', expectedDate: '2025-08-20', status: 'Received' },
];

// ─── Campaigns ────────────────────────────────────────────────────────────────

export const campaigns: Campaign[] = [
  { id: 'camp1', name: 'Retail Growth Campaign', platform: 'Multi-platform', startDate: '2025-07-01', endDate: '2025-09-30', reach: 124000, engagement: 9840, leads: 186, conversions: 22, revenue: 1240000, roi: 4.8, status: 'Active', budget: 180000, spend: 142000 },
  { id: 'camp2', name: 'Wholesale Partner Campaign', platform: 'Instagram', startDate: '2025-07-15', endDate: '2025-09-15', reach: 84200, engagement: 6420, leads: 126, conversions: 12, revenue: 840000, roi: 3.9, status: 'Active', budget: 120000, spend: 98000 },
  { id: 'camp3', name: 'Enterprise B2B — LinkedIn', platform: 'LinkedIn', startDate: '2025-06-01', endDate: '2025-08-31', reach: 42600, engagement: 3180, leads: 64, conversions: 8, revenue: 1920000, roi: 7.2, status: 'Completed', budget: 200000, spend: 186000 },
  { id: 'camp4', name: 'Distributor Outreach', platform: 'Facebook', startDate: '2025-08-01', endDate: '2025-10-31', reach: 62000, engagement: 4820, leads: 98, conversions: 6, revenue: 620000, roi: 2.8, status: 'Active', budget: 150000, spend: 68000 },
];

// ─── Social Posts ─────────────────────────────────────────────────────────────

export const socialPosts: SocialPost[] = [
  { id: 'sp1', title: 'How BizNexuz helps retailers scale', platform: 'Instagram', content: 'Manage inventory, track orders, and grow faster with BizNexuz. One platform for everything your retail business needs. 🚀', status: 'Published', publishDate: '2025-08-20', reach: 42800, likes: 1842, comments: 284, shares: 412, clicks: 2840, enquiries: 184, leadsGenerated: 126, qualifiedLeads: 48, conversions: 12, revenueAttributed: 840000, campaignId: 'camp2' },
  { id: 'sp2', title: 'Enterprise CRM for growing businesses', platform: 'LinkedIn', content: 'BizNexuz delivers enterprise-grade CRM + ERP capabilities at a price point that makes sense for mid-market businesses. See how Nova Distributor grew their sales 40% in 6 months.', status: 'Published', publishDate: '2025-07-15', reach: 28400, likes: 642, comments: 128, shares: 84, clicks: 1420, enquiries: 96, leadsGenerated: 48, qualifiedLeads: 28, conversions: 6, revenueAttributed: 1200000, campaignId: 'camp3' },
  { id: 'sp3', title: 'Q4 Wholesale Partnership Drive', platform: 'Facebook', content: 'Looking for a technology partner that understands wholesale distribution? BizNexuz is built for distributors and wholesalers who want to run smarter operations.', status: 'Scheduled', publishDate: '2025-09-10', reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0, enquiries: 0, leadsGenerated: 0, qualifiedLeads: 0, conversions: 0, revenueAttributed: 0, campaignId: 'camp4' },
  { id: 'sp4', title: 'AI-powered business insights', platform: 'Instagram', content: 'What if your business software could tell you what to do next? BizNexuz AI analyses your data and delivers actionable insights instantly. ✨', status: 'Draft', publishDate: '', reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0, enquiries: 0, leadsGenerated: 0, qualifiedLeads: 0, conversions: 0, revenueAttributed: 0, campaignId: 'camp1' },
];

// ─── Documents ────────────────────────────────────────────────────────────────

export const documents: Document[] = [
  { id: 'd1', name: 'Q2 Sales Report 2025.pdf', category: 'Report', size: '2.4 MB', uploadedBy: 'Aisha Khan', uploadedDate: '2025-07-05', status: 'Indexed', linkedTo: '' },
  { id: 'd2', name: 'Acme Corporation Contract.pdf', category: 'Contract', size: '1.8 MB', uploadedBy: 'Arjun Mehta', uploadedDate: '2025-03-20', status: 'Indexed', linkedTo: 'c1' },
  { id: 'd3', name: 'INV-2048 Invoice.pdf', category: 'Invoice', size: '0.4 MB', uploadedBy: 'Neha Patel', uploadedDate: '2025-08-28', status: 'Indexed', linkedTo: 'INV-2048' },
  { id: 'd4', name: 'QT-1083 Quotation.pdf', category: 'Quotation', size: '0.6 MB', uploadedBy: 'Rahul Sharma', uploadedDate: '2025-07-25', status: 'Indexed', linkedTo: 'QT-1083' },
  { id: 'd5', name: 'Supplier Agreement — TechSource.pdf', category: 'Contract', size: '3.1 MB', uploadedBy: 'Sanjay Kumar', uploadedDate: '2025-01-15', status: 'Indexed', linkedTo: 's1' },
  { id: 'd6', name: 'H1 Finance Summary.pdf', category: 'Report', size: '1.2 MB', uploadedBy: 'Neha Patel', uploadedDate: '2025-07-20', status: 'Indexed', linkedTo: '' },
  { id: 'd7', name: 'PO-0483 Purchase Order.pdf', category: 'Purchase Order', size: '0.3 MB', uploadedBy: 'Sanjay Kumar', uploadedDate: '2025-09-03', status: 'Processing', linkedTo: 'PO-0483' },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications: Notification[] = [
  { id: 'n1', type: 'lead', title: 'New distributor lead received', message: 'Nova Distributor has entered negotiation stage. Potential value: ₹12L', time: '10 min ago', read: false },
  { id: 'n2', type: 'invoice', title: 'Invoice overdue', message: 'INV-2047 for Vertex Solutions (₹2.67L) is 18 days overdue.', time: '1 hour ago', read: false },
  { id: 'n3', type: 'stock', title: 'Low stock alert', message: 'Business Analytics Pro is below reorder level (8 units remaining).', time: '2 hours ago', read: false },
  { id: 'n4', type: 'campaign', title: 'Campaign milestone', message: 'Wholesale Partner Campaign has generated 126 leads this month.', time: '4 hours ago', read: true },
  { id: 'n5', type: 'quotation', title: 'Quotation accepted', message: 'QT-1080 for Orbit Technologies has been accepted. Create order now.', time: '1 day ago', read: true },
  { id: 'n6', type: 'order', title: 'Order delivered', message: 'ORD-1046 for CloudPeak Labs has been delivered successfully.', time: '1 day ago', read: true },
];

// ─── Revenue trend (6 months) ─────────────────────────────────────────────────

export const revenueTrend = [
  { month: 'Apr', revenue: 1840000, expenses: 980000, profit: 860000 },
  { month: 'May', revenue: 2120000, expenses: 1080000, profit: 1040000 },
  { month: 'Jun', revenue: 2480000, expenses: 1240000, profit: 1240000 },
  { month: 'Jul', revenue: 2280000, expenses: 1180000, profit: 1100000 },
  { month: 'Aug', revenue: 2840000, expenses: 1320000, profit: 1520000 },
  { month: 'Sep', revenue: 3120000, expenses: 1460000, profit: 1660000 },
];

export const leadTrend = [
  { month: 'Apr', new: 28, qualified: 14, converted: 5 },
  { month: 'May', new: 34, qualified: 18, converted: 7 },
  { month: 'Jun', new: 42, qualified: 24, converted: 9 },
  { month: 'Jul', new: 38, qualified: 20, converted: 8 },
  { month: 'Aug', new: 52, qualified: 28, converted: 11 },
  { month: 'Sep', new: 48, qualified: 26, converted: 10 },
];

export const leadsBySource = [
  { source: 'Instagram', value: 126, color: '#E1306C' },
  { source: 'Facebook', value: 84, color: '#1877F2' },
  { source: 'LinkedIn', value: 64, color: '#0A66C2' },
  { source: 'Website', value: 52, color: '#2563EB' },
  { source: 'Sales Team', value: 38, color: '#16A34A' },
  { source: 'Referral', value: 28, color: '#7C3AED' },
  { source: 'Events', value: 18, color: '#F59E0B' },
  { source: 'Other', value: 22, color: '#94A3B8' },
];

export const salesByRegion = [
  { region: 'Maharashtra', value: 2840000 },
  { region: 'Karnataka', value: 1920000 },
  { region: 'Delhi', value: 1680000 },
  { region: 'Tamil Nadu', value: 1240000 },
  { region: 'Telangana', value: 1120000 },
  { region: 'Gujarat', value: 860000 },
];

export const revenueByCategory = [
  { name: 'CRM Suite', value: 4032000, color: '#2563EB' },
  { name: 'Analytics Pro', value: 2232000, color: '#7C3AED' },
  { name: 'AI Assistant', value: 2280000, color: '#8B5CF6' },
  { name: 'Cloud ERP', value: 2436000, color: '#16A34A' },
  { name: 'Inventory Mgmt', value: 1080000, color: '#F59E0B' },
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
