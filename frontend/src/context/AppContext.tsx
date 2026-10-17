import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  demoUsers,
  notifications as initialNotifications,
  products as initialDemoProducts,
  customers as initialDemoCustomers,
  salesOrders as initialDemoSalesOrders,
  purchaseOrders as initialDemoPurchaseOrders,
  suppliers as initialDemoSuppliers,
  invoices as initialDemoInvoices,
  payments as initialDemoPayments,
  expenses as initialDemoExpenses,
  leads as initialDemoLeads,
  quotations as initialDemoQuotations,
  documents as initialDemoDocuments,
  campaigns as initialDemoCampaigns,
  socialPosts as initialDemoSocialPosts,
  type DemoUser,
  type Notification,
  type Role,
  type Product,
  type Customer,
  type SalesOrder,
  type PurchaseOrder,
  type Supplier,
  type Invoice,
  type Payment,
  type Expense,
  type Lead,
  type Quotation,
  type Document,
  type Campaign,
  type SocialPost,
} from '../data/mockData';
import {
  apiRegister, apiLogin, apiAddUser, apiGetCompanyUsers, apiGetPermissions,
  apiSaveRolePermission, apiSaveBulkRolePermissions, apiSaveUserPermission,
  apiUpdateUser, apiDeleteUser, apiSaveBulkUserPermissions,
  apiGetCustomers, apiAddCustomer, apiBulkAddCustomers, apiUpdateCustomer, apiDeleteCustomer,
  type RegisterPayload, type ApiUser, type ApiCompany, type PermRow,
} from '../services/api';

export type { Role, Product, Customer, SalesOrder, PurchaseOrder, Supplier, Invoice, Payment, Expense, Lead, Quotation, Document, Campaign, SocialPost };

// ─── RBAC ─────────────────────────────────────────────────────────────────────

export const ROLE_MODULES: Record<Role, string[]> = {
  'Business Owner': [
    'dashboard', 'leads', 'customers', 'sales-orders', 'quotations',
    'products', 'inventory', 'purchases', 'suppliers',
    'finance', 'invoices', 'payments', 'expenses',
    'social-content', 'campaigns', 'analytics', 'documents',
    'ai-assistant', 'users-roles', 'settings',
  ],
  'Sales Manager': [
    'dashboard', 'leads', 'customers', 'sales-orders', 'quotations',
    'analytics', 'ai-assistant',
  ],
  'Sales Executive': [
    'dashboard', 'leads', 'customers', 'sales-orders', 'quotations',
    'ai-assistant',
  ],
  'Marketing Manager': [
    'dashboard', 'leads', 'social-content', 'campaigns',
    'analytics', 'ai-assistant',
  ],
  'Inventory Manager': [
    'dashboard', 'products', 'inventory', 'analytics', 'ai-assistant',
  ],
  'Purchase Manager': [
    'dashboard', 'inventory', 'purchases', 'suppliers',
    'analytics', 'ai-assistant',
  ],
  'Finance Manager': [
    'dashboard', 'finance', 'invoices', 'payments', 'expenses',
    'analytics', 'ai-assistant',
  ],
  'Business Analyst': [
    'dashboard', 'analytics', 'documents', 'ai-assistant',
  ],
};

export type Permission = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'approve';

export interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  approve: boolean;
}

function buildFullPermissions(): Record<string, ModulePermissions> {
  const modules = [
    'leads', 'customers', 'sales-orders', 'quotations', 'products', 'inventory',
    'purchases', 'suppliers', 'finance', 'invoices', 'payments', 'expenses',
    'social-content', 'campaigns', 'analytics', 'documents', 'ai-assistant',
    'users-roles', 'settings',
  ];
  return Object.fromEntries(
    modules.map(m => [m, { view: true, create: true, edit: true, delete: true, export: true, approve: true }])
  );
}

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Record<string, ModulePermissions>> = {
  'Business Owner': buildFullPermissions(),
  'Sales Manager': {
    leads: { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    customers: { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'sales-orders': { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    quotations: { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    analytics: { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'ai-assistant': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
  },
  'Sales Executive': {
    leads: { view: true, create: true, edit: true, delete: false, export: false, approve: false },
    customers: { view: true, create: true, edit: true, delete: false, export: false, approve: false },
    'sales-orders': { view: true, create: true, edit: false, delete: false, export: false, approve: false },
    quotations: { view: true, create: true, edit: true, delete: false, export: false, approve: false },
    'ai-assistant': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
  },
  'Marketing Manager': {
    leads: { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'social-content': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    campaigns: { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    analytics: { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'ai-assistant': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
  },
  'Inventory Manager': {
    products: { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    inventory: { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    analytics: { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'ai-assistant': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
  },
  'Purchase Manager': {
    products: { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    purchases: { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    suppliers: { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    analytics: { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'ai-assistant': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
  },
  'Finance Manager': {
    finance: { view: true, create: false, edit: false, delete: false, export: true, approve: true },
    invoices: { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    payments: { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    expenses: { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    analytics: { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'ai-assistant': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
  },
  'Business Analyst': {
    analytics: { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    documents: { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'ai-assistant': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
  },
};

// ─── Company & Tenant State ──────────────────────────────────────────────────

export interface CompanyProfile {
  companyName: string;
  tradingName?: string;
  industry: string;
  companySize: string;
  website?: string;
  registeredAddress: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  gstin: string;
  panNumber: string;
  cinNumber?: string;
  incorporationDate?: string;
  complianceCert: string;
  taxRegistrationProof?: string;
  isVerified: boolean;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerDesignation: string;
  selectedModules: string[];
  enabledRoles: Role[];
  tenantId: string;
  createdAt: string;
}

export const DEFAULT_COMPANY: CompanyProfile = {
  companyName: 'Nestlé India Limited',
  tradingName: 'Nestlé Nutrition, Health & Wellness',
  industry: 'Food & Beverages',
  companySize: '1000+ employees',
  website: 'https://www.nestle.in',
  registeredAddress: "Nestlé House, Jacaranda Marg, 'M' Block, DLF City Phase II",
  city: 'Gurugram',
  state: 'Haryana',
  country: 'India',
  pincode: '122002',
  gstin: '06AAACN1234F1ZV',
  panNumber: 'AAACN1234F',
  cinNumber: 'L15202DL1959PLC003786',
  incorporationDate: '1959-03-28',
  complianceCert: 'FSSAI Central Lic. & ISO 22000',
  isVerified: true,
  ownerName: 'Suresh Narayanan',
  ownerEmail: 'suresh@nestle.in',
  ownerPhone: '+91 98201 44890',
  ownerDesignation: 'Chairman & Managing Director',
  selectedModules: [
    'dashboard', 'leads', 'customers', 'sales-orders', 'quotations',
    'products', 'inventory', 'purchases', 'suppliers',
    'finance', 'invoices', 'payments', 'expenses',
    'social-content', 'campaigns', 'analytics', 'documents',
    'ai-assistant', 'users-roles', 'settings'
  ],
  enabledRoles: [
    'Business Owner', 'Sales Manager', 'Sales Executive', 'Marketing Manager',
    'Inventory Manager', 'Purchase Manager', 'Finance Manager', 'Business Analyst'
  ],
  tenantId: 'tenant-nestle-master',
  createdAt: '1959-03-28T00:00:00.000Z',
};

// ─── User overrides ──────────────────────────────────────────────────────────

export interface UserOverride {
  module: string;
  permission: Permission;
  granted: boolean;
}

// ─── Auth mode ────────────────────────────────────────────────────────────────
// 'demo' = using in-memory demo data (no real DB credentials)
// 'real' = logged in with a real DB account from a registered company
type AuthMode = 'demo' | 'real';

// ─── Context interface ────────────────────────────────────────────────────────

interface AppContextValue {
  // State
  currentUser: DemoUser;
  setCurrentUser: (user: DemoUser) => void;
  availableUsers: DemoUser[];
  company: CompanyProfile;
  isLoggedIn: boolean;
  authMode: AuthMode;
  // Current company id (for real-auth mode, used in API calls)
  companyId: string | null;

  // Tenant Entities (Clean workspace for new registrations, demo Nestlé data in demo mode)
  products: Product[];
  customers: Customer[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  leads: Lead[];
  quotations: Quotation[];
  documents: Document[];
  campaigns: Campaign[];
  socialPosts: SocialPost[];

  // Mutators
  addProduct: (product: Product) => void;
  addCustomer: (customer: Customer) => Promise<Customer> | void;
  addCustomersBulk: (customers: Customer[]) => Promise<Customer[]>;
  updateCustomer: (customer: Customer) => Promise<Customer>;
  deleteCustomer: (customerId: string) => Promise<void>;
  addSalesOrder: (order: SalesOrder) => void;
  addPurchaseOrder: (po: PurchaseOrder) => void;
  addSupplier: (supplier: Supplier) => void;
  addInvoice: (invoice: Invoice) => void;
  addPayment: (payment: Payment) => void;
  addLead: (lead: Lead) => void;
  addQuotation: (quotation: Quotation) => void;
  addExpense: (expense: Expense) => void;
  addDocument: (document: Document) => void;
  addCampaign: (campaign: Campaign) => void;
  addSocialPost: (post: SocialPost) => void;
  saveRolePermissions: (role: string, perms: Record<string, ModulePermissions>) => Promise<void>;

  // Registration — saves to DB, returns owner user
  registerCompany: (newProfile: CompanyProfile, password: string) => Promise<DemoUser>;

  // Login — checks DB or demo fallback
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  // Demo switcher — still available on login page
  login: (userId: string) => void;
  logout: () => void;

  // User management (real mode → DB, demo mode → in-memory)
  addUser: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
    department: string;
  }) => Promise<DemoUser>;
  updateUser: (userId: string, userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    department: string;
    password?: string;
  }) => Promise<DemoUser>;
  deleteUser: (userId: string) => Promise<void>;
  saveUserPermissions: (userId: string, overrides: Array<{ module: string; permission: Permission; granted: boolean }>) => Promise<void>;

  // Notifications
  notifications: Notification[];
  markAllRead: () => void;
  unreadCount: number;

  // RBAC
  hasModule: (module: string) => boolean;
  hasPermission: (module: string, permission: Permission) => boolean;
  userOverrides: Record<string, UserOverride[]>;
  setUserOverride: (userId: string, module: string, permission: Permission, granted: boolean) => void;
  rolePermissions: Record<string, Record<string, ModulePermissions>>;
  setRolePermission: (role: string, module: string, permission: Permission, granted: boolean) => Promise<void>;

  // Search / UI
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  aiSidebarOpen: boolean;
  setAiSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleAiSidebar: () => void;

  // API error from last operation
  apiError: string;
  clearApiError: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// Helper: convert ApiUser → DemoUser
function apiUserToDemoUser(u: ApiUser): DemoUser {
  return {
    id: u.id,
    name: u.name,
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email,
    role: u.role as Role,
    avatar: u.avatar,
    department: u.department,
  };
}

// Helper: convert ApiCompany → CompanyProfile
function apiCompanyToProfile(c: ApiCompany, ownerEmail: string, ownerPhone: string): CompanyProfile {
  return {
    companyName: c.name,
    tradingName: c.trading_name,
    industry: c.industry,
    companySize: c.company_size,
    website: c.website,
    registeredAddress: '',
    city: c.city,
    state: c.state,
    country: c.country,
    pincode: '',
    gstin: '',
    panNumber: '',
    complianceCert: '',
    isVerified: true,
    ownerName: c.owner_name,
    ownerEmail,
    ownerPhone,
    ownerDesignation: c.owner_designation,
    selectedModules: c.selected_modules,
    enabledRoles: c.enabled_roles as Role[],
    tenantId: c.tenant_id,
    createdAt: c.created_at,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  // ── Demo state (always present) ──────────────────────────────────────────
  const [availableUsers, setAvailableUsers] = useState<DemoUser[]>(demoUsers);
  const [currentUser, setCurrentUserState] = useState<DemoUser>(demoUsers[0]);
  const [company, setCompany] = useState<CompanyProfile>(DEFAULT_COMPANY);
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('demo');
  const [companyId, setCompanyId] = useState<string | null>(null);

  // ── Tenant Data state (Clean for new company registrations, demo Nestlé F&B data in demo mode) ──
  const [products, setProducts] = useState<Product[]>(initialDemoProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialDemoCustomers);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialDemoSalesOrders);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialDemoPurchaseOrders);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialDemoSuppliers);
  const [invoices, setInvoices] = useState<Invoice[]>(initialDemoInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialDemoPayments);
  const [expenses, setExpenses] = useState<Expense[]>(initialDemoExpenses);
  const [leads, setLeads] = useState<Lead[]>(initialDemoLeads);
  const [quotations, setQuotations] = useState<Quotation[]>(initialDemoQuotations);
  const [documents, setDocuments] = useState<Document[]>(initialDemoDocuments);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialDemoCampaigns);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(initialDemoSocialPosts);

  const addProduct = (product: Product) => setProducts(prev => [product, ...prev]);

  const addCustomer = async (customer: Customer): Promise<Customer> => {
    if (authMode === 'real' && companyId) {
      try {
        const res = await apiAddCustomer(companyId, customer);
        const created = (res && res.customer) ? res.customer : customer;
        setCustomers(prev => [created, ...prev.filter(c => c.id !== created.id)]);
        return created;
      } catch (err) {
        console.error('Failed to add customer to DB:', err);
        setCustomers(prev => [customer, ...prev]);
        return customer;
      }
    }
    setCustomers(prev => [customer, ...prev]);
    return customer;
  };

  const addCustomersBulk = async (newCustomers: Customer[]): Promise<Customer[]> => {
    if (authMode === 'real' && companyId) {
      try {
        const res = await apiBulkAddCustomers(companyId, newCustomers);
        const createdList = (res && res.customers && res.customers.length) ? res.customers : newCustomers;
        setCustomers(prev => [...createdList, ...prev]);
        return createdList;
      } catch (err) {
        console.error('Failed to bulk add customers to DB:', err);
        setCustomers(prev => [...newCustomers, ...prev]);
        return newCustomers;
      }
    }
    setCustomers(prev => [...newCustomers, ...prev]);
    return newCustomers;
  };

  const updateCustomer = async (customer: Customer): Promise<Customer> => {
    if (authMode === 'real' && companyId) {
      try {
        const res = await apiUpdateCustomer(companyId, customer.id, customer);
        const updated = (res && res.customer) ? res.customer : customer;
        setCustomers(prev => prev.map(c => c.id === customer.id ? updated : c));
        return updated;
      } catch (err) {
        console.error('Failed to update customer in DB:', err);
        setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
        return customer;
      }
    }
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    return customer;
  };

  const deleteCustomer = async (customerId: string): Promise<void> => {
    if (authMode === 'real' && companyId) {
      try {
        await apiDeleteCustomer(companyId, customerId);
      } catch (err) {
        console.error('Failed to delete customer from DB:', err);
      }
    }
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const addSalesOrder = (order: SalesOrder) => setSalesOrders(prev => [order, ...prev]);
  const addPurchaseOrder = (po: PurchaseOrder) => setPurchaseOrders(prev => [po, ...prev]);
  const addSupplier = (supplier: Supplier) => setSuppliers(prev => [supplier, ...prev]);
  const addInvoice = (invoice: Invoice) => setInvoices(prev => [invoice, ...prev]);
  const addPayment = (payment: Payment) => setPayments(prev => [payment, ...prev]);
  const addLead = (lead: Lead) => setLeads(prev => [lead, ...prev]);
  const addQuotation = (quotation: Quotation) => setQuotations(prev => [quotation, ...prev]);
  const addExpense = (expense: Expense) => setExpenses(prev => [expense, ...prev]);
  const addDocument = (document: Document) => setDocuments(prev => [document, ...prev]);
  const addCampaign = (campaign: Campaign) => setCampaigns(prev => [campaign, ...prev]);
  const addSocialPost = (post: SocialPost) => setSocialPosts(prev => [post, ...prev]);

  const resetToDemoData = () => {
    setProducts(initialDemoProducts);
    setCustomers(initialDemoCustomers);
    setSalesOrders(initialDemoSalesOrders);
    setPurchaseOrders(initialDemoPurchaseOrders);
    setSuppliers(initialDemoSuppliers);
    setInvoices(initialDemoInvoices);
    setPayments(initialDemoPayments);
    setExpenses(initialDemoExpenses);
    setLeads(initialDemoLeads);
    setQuotations(initialDemoQuotations);
    setDocuments(initialDemoDocuments);
    setCampaigns(initialDemoCampaigns);
    setSocialPosts(initialDemoSocialPosts);
  };

  const clearTenantData = () => {
    setProducts([]);
    setCustomers([]);
    setSalesOrders([]);
    setPurchaseOrders([]);
    setSuppliers([]);
    setInvoices([]);
    setPayments([]);
    setExpenses([]);
    setLeads([]);
    setQuotations([]);
    setDocuments([]);
    setCampaigns([]);
    setSocialPosts([]);
  };

  // ── UI state ─────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [userOverrides, setUserOverrides] = useState<Record<string, UserOverride[]>>({});
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, ModulePermissions>>>(DEFAULT_ROLE_PERMISSIONS);
  const [apiError, setApiError] = useState('');

  const clearApiError = () => setApiError('');
  const toggleAiSidebar = () => setAiSidebarOpen(prev => !prev);
  const setCurrentUser = (user: DemoUser) => setCurrentUserState(user);

  const applyDbPermissions = (rows: PermRow[]) => {
    setRolePermissions(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      rows.forEach(r => {
        if (r.role) {
          if (!next[r.role]) next[r.role] = {};
          next[r.role][r.module] = {
            view: Boolean(r.perm_view),
            create: Boolean(r.perm_create),
            edit: Boolean(r.perm_edit),
            delete: Boolean(r.perm_delete),
            export: Boolean(r.perm_export),
            approve: Boolean(r.perm_approve),
          };
        }
      });
      return next;
    });

    setUserOverrides(prev => {
      const next: Record<string, UserOverride[]> = { ...prev };
      rows.forEach(r => {
        if (r.user_id) {
          if (!next[r.user_id]) next[r.user_id] = [];
          const perms: Permission[] = ['view', 'create', 'edit', 'delete', 'export', 'approve'];
          const permVals = [r.perm_view, r.perm_create, r.perm_edit, r.perm_delete, r.perm_export, r.perm_approve];
          perms.forEach((p, idx) => {
            const existingIdx = next[r.user_id!].findIndex(o => o.module === r.module && o.permission === p);
            const overrideObj = { module: r.module, permission: p, granted: Boolean(permVals[idx]) };
            if (existingIdx >= 0) {
              next[r.user_id!][existingIdx] = overrideObj;
            } else {
              next[r.user_id!].push(overrideObj);
            }
          });
        }
      });
      return next;
    });
  };

  // ── Register (saves to DB) ────────────────────────────────────────────────
  const registerCompany = async (newProfile: CompanyProfile, password: string): Promise<DemoUser> => {
    try {
      const modules = [...newProfile.selectedModules];
      for (const req of ['dashboard', 'users-roles', 'settings']) {
        if (!modules.includes(req)) modules.push(req);
      }

      const payload: RegisterPayload = {
        owner_name: newProfile.ownerName,
        owner_email: newProfile.ownerEmail,
        owner_phone: newProfile.ownerPhone,
        owner_designation: newProfile.ownerDesignation,
        password,
        company_name: newProfile.companyName,
        trading_name: newProfile.tradingName,
        industry: newProfile.industry,
        company_size: newProfile.companySize,
        website: newProfile.website,
        address: newProfile.registeredAddress,
        city: newProfile.city,
        state: newProfile.state,
        country: newProfile.country,
        pincode: newProfile.pincode,
        selected_modules: modules,
        enabled_roles: newProfile.enabledRoles,
      };

      const result = await apiRegister(payload);

      const ownerUser = apiUserToDemoUser(result.user);
      const profile = apiCompanyToProfile(result.company, newProfile.ownerEmail, newProfile.ownerPhone);

      setCompany(profile);
      setCompanyId(result.company_id);
      setAvailableUsers([ownerUser]);
      setCurrentUserState(ownerUser);
      setIsLoggedIn(true);
      setAuthMode('real');
      clearTenantData();

      const welcomeNotif: Notification = {
        id: `n-${Date.now()}`,
        type: 'system' as any,
        title: `${profile.companyName} workspace deployed`,
        message: `${modules.length} modules and ${newProfile.enabledRoles.length} RBAC roles initialized.`,
        time: 'Just now',
        read: false,
      };
      setNotifs(prev => [welcomeNotif, ...prev]);

      return ownerUser;
    } catch (err: any) {
      setApiError(err.message || 'Registration failed');
      throw err;
    }
  };

  // ── Login with real credentials ───────────────────────────────────────────
  const loginWithCredentials = async (email: string, password: string): Promise<void> => {
    try {
      const result = await apiLogin(email, password);

      const user = apiUserToDemoUser(result.user);
      const profile = apiCompanyToProfile(result.company, result.user.email, '');

      // Fetch all users from this company so the sidebar switcher works
      const companyUsers = await apiGetCompanyUsers(result.user.company_id);
      const dbUsers = companyUsers.map(apiUserToDemoUser);

      setCompany(profile);
      setCompanyId(result.user.company_id);
      setAvailableUsers(dbUsers.length ? dbUsers : [user]);
      setCurrentUserState(user);
      setIsLoggedIn(true);
      setAuthMode('real');
      clearTenantData();

      // Hydrate permissions from DB
      try {
        const perms = await apiGetPermissions(result.user.company_id);
        if (Array.isArray(perms) && perms.length > 0) {
          applyDbPermissions(perms);
        }
      } catch (pErr) {
        console.warn('Failed to fetch company permissions:', pErr);
      }

      // Hydrate customers from DB
      try {
        const dbCusts = await apiGetCustomers(result.user.company_id);
        if (Array.isArray(dbCusts) && dbCusts.length > 0) {
          setCustomers(dbCusts);
        }
      } catch (cErr) {
        console.warn('Failed to fetch company customers:', cErr);
      }
    } catch (err: any) {
      throw err; // let Login page display the error
    }
  };

  // ── Demo switcher (login page user picker) ────────────────────────────────
  const login = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId) || demoUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserState(user);
      setIsLoggedIn(true);
      resetToDemoData();
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthMode('demo');
    setCompanyId(null);
    setAvailableUsers(demoUsers);
    setCurrentUserState(demoUsers[0]);
    setCompany(DEFAULT_COMPANY);
    setUserOverrides({});
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    resetToDemoData();
  };

  // ── Add user (real mode → DB, demo mode → in-memory) ─────────────────────
  const addUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
    department: string;
  }): Promise<DemoUser> => {
    if (authMode === 'real' && companyId) {
      const result = await apiAddUser({
        company_id: companyId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        department: userData.department,
      });
      const newUser = apiUserToDemoUser(result.user);
      setAvailableUsers(prev => [...prev, newUser]);
      return newUser;
    }
    // Demo fallback (in-memory only)
    const avatar = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
    const newUser: DemoUser = {
      id: `u-${Date.now()}`,
      name: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      avatar,
      department: userData.department,
    };
    setAvailableUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // ── Update user ──────────────────────────────────────────────────────────
  const updateUser = async (userId: string, userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    department: string;
    password?: string;
  }): Promise<DemoUser> => {
    if (authMode === 'real' && companyId) {
      const result = await apiUpdateUser(userId, {
        company_id: companyId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        password: userData.password,
      });
      const updatedUser = apiUserToDemoUser(result.user);
      setAvailableUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      if (currentUser.id === userId) {
        setCurrentUserState(updatedUser);
      }
      return updatedUser;
    }
    // Demo mode fallback
    const avatar = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
    const updatedUser: DemoUser = {
      id: userId,
      name: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      avatar,
      department: userData.department,
    };
    setAvailableUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (currentUser.id === userId) {
      setCurrentUserState(updatedUser);
    }
    return updatedUser;
  };

  // ── Delete user ──────────────────────────────────────────────────────────
  const deleteUser = async (userId: string): Promise<void> => {
    const user = availableUsers.find(u => u.id === userId);
    if (user?.role === 'Business Owner' || user?.id === currentUser.id) {
      throw new Error('Cannot delete company administrator or your own active account.');
    }
    if (authMode === 'real' && companyId) {
      await apiDeleteUser(userId, companyId);
    }
    setAvailableUsers(prev => prev.filter(u => u.id !== userId));
    setUserOverrides(prev => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  };

  // ── Save user-level permission overrides explicitly ───────────────────────
  const saveUserPermissions = async (
    userId: string,
    overrides: Array<{ module: string; permission: Permission; granted: boolean }>
  ): Promise<void> => {
    setUserOverrides(prev => ({
      ...prev,
      [userId]: overrides,
    }));
    if (authMode === 'real' && companyId) {
      const modules = [...new Set(overrides.map(o => o.module))];
      const user = availableUsers.find(u => u.id === userId);
      const userRole = user?.role || 'Sales Executive';
      const basePerms = rolePermissions[userRole] || DEFAULT_ROLE_PERMISSIONS[userRole] || {};

      const list = modules.map(mod => {
        const modBase = basePerms[mod] || { view: false, create: false, edit: false, delete: false, export: false, approve: false };
        const modOverrides = overrides.filter(o => o.module === mod);
        const effective = { ...modBase };
        modOverrides.forEach(o => {
          (effective as any)[o.permission] = o.granted;
        });
        return {
          company_id: companyId,
          user_id: userId,
          module: mod,
          view: effective.view,
          create: effective.create,
          edit: effective.edit,
          delete: effective.delete,
          export: effective.export,
          approve: effective.approve,
        };
      });

      if (list.length > 0) {
        await apiSaveBulkUserPermissions({
          company_id: companyId,
          overrides: list,
        });
      }
    }
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifs.filter(n => !n.read).length;

  // ── RBAC helpers ──────────────────────────────────────────────────────────
  const hasModule = (module: string) => {
    if (company.selectedModules && !company.selectedModules.includes(module)) return false;
    if (currentUser.role === 'Business Owner') return true;
    const rolePerm = rolePermissions[currentUser.role]?.[module] ?? DEFAULT_ROLE_PERMISSIONS[currentUser.role]?.[module];
    if (rolePerm && !rolePerm.view) return false;
    return ROLE_MODULES[currentUser.role]?.includes(module) ?? false;
  };

  const hasPermission = (module: string, permission: Permission) => {
    if (company.selectedModules && !company.selectedModules.includes(module)) return false;
    if (currentUser.role === 'Business Owner') return true;
    const rolePerm = rolePermissions[currentUser.role]?.[module] ?? DEFAULT_ROLE_PERMISSIONS[currentUser.role]?.[module];
    if (!rolePerm) return false;
    const baseValue = Boolean(rolePerm[permission]);
    const overrides = userOverrides[currentUser.id] ?? [];
    const override = overrides.find(o => o.module === module && o.permission === permission);
    return override ? override.granted : baseValue;
  };

  const setRolePermission = async (role: string, module: string, perm: Permission, granted: boolean) => {
    setRolePermissions(prev => {
      const currentRolePerms = prev[role as Role] || {};
      const currentModulePerms = currentRolePerms[module] || {
        view: false, create: false, edit: false, delete: false, export: false, approve: false,
      };
      const updatedModulePerms = { ...currentModulePerms, [perm]: granted };
      return {
        ...prev,
        [role]: {
          ...currentRolePerms,
          [module]: updatedModulePerms,
        },
      };
    });

    if (authMode === 'real' && companyId) {
      const currentModulePerms = rolePermissions[role]?.[module] || {
        view: false, create: false, edit: false, delete: false, export: false, approve: false,
      };
      const toSave = { ...currentModulePerms, [perm]: granted };
      await apiSaveRolePermission({
        company_id: companyId,
        role,
        module,
        view: toSave.view,
        create: toSave.create,
        edit: toSave.edit,
        delete: toSave.delete,
        export: toSave.export,
        approve: toSave.approve,
      });
    }
  };

  const saveRolePermissions = async (role: string, perms: Record<string, ModulePermissions>) => {
    if (role === 'Business Owner') {
      throw new Error('Business Owner has permanent full access. An admin cannot modify permissions for themselves.');
    }
    setRolePermissions(prev => ({
      ...prev,
      [role]: perms,
    }));
    if (authMode === 'real' && companyId) {
      const list = Object.entries(perms).map(([module, p]) => ({
        company_id: companyId,
        role,
        module,
        view: Boolean(p.view),
        create: Boolean(p.create),
        edit: Boolean(p.edit),
        delete: Boolean(p.delete),
        export: Boolean(p.export),
        approve: Boolean(p.approve),
      }));
      await apiSaveBulkRolePermissions({
        company_id: companyId,
        permissions: list,
      });
    }
  };

  const setUserOverride = (userId: string, module: string, permission: Permission, granted: boolean) => {
    setUserOverrides(prev => {
      const existing = prev[userId] ?? [];
      const filtered = existing.filter(o => !(o.module === module && o.permission === permission));
      return { ...prev, [userId]: [...filtered, { module, permission, granted }] };
    });
    // Persist to DB if in real mode
    if (authMode === 'real' && companyId) {
      // Build current effective permissions for this module + user to send in bulk
      const user = availableUsers.find(u => u.id === userId);
      if (user) {
        const role = user.role as Role;
        const base = (rolePermissions[role]?.[module] ?? DEFAULT_ROLE_PERMISSIONS[role]?.[module]) ?? { view: false, create: false, edit: false, delete: false, export: false, approve: false };
        const existing = userOverrides[userId] ?? [];
        const merged = { ...base };
        existing.forEach(o => { (merged as any)[o.permission] = o.granted; });
        (merged as any)[permission] = granted;
        apiSaveUserPermission({
          company_id: companyId,
          user_id: userId,
          module,
          view: merged.view,
          create: merged.create,
          edit: merged.edit,
          delete: merged.delete,
          export: merged.export,
          approve: merged.approve,
        }).catch(console.warn);
      }
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      availableUsers,
      company,
      isLoggedIn,
      authMode,
      companyId,
      products, customers, salesOrders, purchaseOrders, suppliers, invoices, payments, expenses, leads, quotations, documents, campaigns, socialPosts,
      addProduct, addCustomer, addCustomersBulk, updateCustomer, deleteCustomer, addSalesOrder, addPurchaseOrder, addSupplier, addInvoice, addPayment, addLead, addQuotation, addExpense, addDocument, addCampaign, addSocialPost,
      registerCompany,
      loginWithCredentials,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      saveUserPermissions,
      notifications: notifs, markAllRead, unreadCount,
      hasModule, hasPermission,
      userOverrides, setUserOverride,
      rolePermissions, setRolePermission, saveRolePermissions,
      searchQuery, setSearchQuery,
      showSearch, setShowSearch,
      aiSidebarOpen, setAiSidebarOpen, toggleAiSidebar,
      apiError, clearApiError,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
