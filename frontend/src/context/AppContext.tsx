import { createContext, useContext, useState, type ReactNode } from 'react';
import { demoUsers, notifications as initialNotifications, type DemoUser, type Notification, type Role } from '../data/mockData';

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

const DEFAULT_ROLE_PERMISSIONS: Record<Role, Record<string, ModulePermissions>> = {
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
  // Authenticity & Verification
  gstin: string;
  panNumber: string;
  cinNumber?: string;
  incorporationDate?: string;
  complianceCert: string;
  taxRegistrationProof?: string;
  isVerified: boolean;
  // Owner Credentials
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerDesignation: string;
  // Selected Modules & Portal Roles
  selectedModules: string[];
  enabledRoles: Role[];
  tenantId: string;
  createdAt: string;
}

export const DEFAULT_COMPANY: CompanyProfile = {
  companyName: 'BizNexus Technologies Pvt. Ltd.',
  tradingName: 'BizNexus Global',
  industry: 'Technology & Enterprise SaaS',
  companySize: '51-200 employees',
  website: 'https://biznexus.in',
  registeredAddress: 'Level 14, Commercial Tower, Bandra Kurla Complex',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  pincode: '400051',
  gstin: 'GSTIN27AAACB1234F1Z5',
  panNumber: 'AAACB1234F',
  cinNumber: 'U72200MH2024PTC123456',
  incorporationDate: '2024-03-15',
  complianceCert: 'ISO 27001 / SOC-2 Type II Certified',
  isVerified: true,
  ownerName: 'Arjun Mehta',
  ownerEmail: 'arjun@biznexuz.com',
  ownerPhone: '+91 98201 55678',
  ownerDesignation: 'Founder & Managing Director',
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
  tenantId: 'tenant-bnx-master',
  createdAt: '2024-03-15T00:00:00.000Z',
};

// ─── User-level overrides (for demo) ─────────────────────────────────────────

export interface UserOverride {
  module: string;
  permission: Permission;
  granted: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  currentUser: DemoUser;
  setCurrentUser: (user: DemoUser) => void;
  availableUsers: DemoUser[];
  company: CompanyProfile;
  registerCompany: (newProfile: CompanyProfile) => DemoUser;
  notifications: Notification[];
  markAllRead: () => void;
  unreadCount: number;
  hasModule: (module: string) => boolean;
  hasPermission: (module: string, permission: Permission) => boolean;
  userOverrides: Record<string, UserOverride[]>;
  setUserOverride: (userId: string, module: string, permission: Permission, granted: boolean) => void;
  isLoggedIn: boolean;
  login: (userId: string) => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  aiSidebarOpen: boolean;
  setAiSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleAiSidebar: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [availableUsers, setAvailableUsers] = useState<DemoUser[]>(demoUsers);
  const [currentUser, setCurrentUserState] = useState<DemoUser>(demoUsers[0]);
  const [company, setCompany] = useState<CompanyProfile>(DEFAULT_COMPANY);
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [userOverrides, setUserOverrides] = useState<Record<string, UserOverride[]>>({});

  const toggleAiSidebar = () => setAiSidebarOpen(prev => !prev);

  const setCurrentUser = (user: DemoUser) => setCurrentUserState(user);

  const registerCompany = (newProfile: CompanyProfile): DemoUser => {
    setCompany(newProfile);

    // Create primary owner account
    const initials = newProfile.ownerName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'BO';

    const ownerUser: DemoUser = {
      id: `u-${Date.now()}-owner`,
      name: newProfile.ownerName,
      email: newProfile.ownerEmail,
      role: 'Business Owner',
      avatar: initials,
      department: 'Executive Leadership',
    };

    // Pre-populate company users for the roles chosen by the business owner
    const domain = newProfile.ownerEmail.includes('@')
      ? newProfile.ownerEmail.split('@')[1]
      : `${newProfile.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    const generatedCompanyUsers: DemoUser[] = [ownerUser];

    const roleStaffPresets: Record<Role, { name: string; avatar: string; department: string }> = {
      'Business Owner': { name: newProfile.ownerName, avatar: initials, department: 'Executive Leadership' },
      'Sales Manager': { name: 'Kunal Singhania', avatar: 'KS', department: 'Commercial & Sales' },
      'Sales Executive': { name: 'Riya Sen', avatar: 'RS', department: 'Enterprise Sales' },
      'Marketing Manager': { name: 'Aditya Roy', avatar: 'AR', department: 'Growth Marketing' },
      'Inventory Manager': { name: 'Devendra Varma', avatar: 'DV', department: 'Warehouse & Logistics' },
      'Purchase Manager': { name: 'Mohit Agarwal', avatar: 'MA', department: 'Procurement' },
      'Finance Manager': { name: 'Simran Walia', avatar: 'SW', department: 'Treasury & Finance' },
      'Business Analyst': { name: 'Tanvi Joshi', avatar: 'TJ', department: 'Corporate Strategy' },
    };

    newProfile.enabledRoles.forEach((role, idx) => {
      if (role === 'Business Owner') return;
      const preset = roleStaffPresets[role];
      const prefix = preset.name.toLowerCase().replace(/\s+/g, '.');
      generatedCompanyUsers.push({
        id: `u-${Date.now()}-${idx}`,
        name: preset.name,
        email: `${prefix}@${domain}`,
        role,
        avatar: preset.avatar,
        department: preset.department,
      });
    });

    setAvailableUsers(generatedCompanyUsers);
    setCurrentUserState(ownerUser);
    setIsLoggedIn(true);

    // Add high-priority welcome notifications for new workspace deployment
    const welcomeNotif: Notification = {
      id: `n-${Date.now()}`,
      type: 'system' as any,
      title: `${newProfile.companyName} Workspace Deployed`,
      message: `Tenant ${newProfile.tenantId} verified (GSTIN ${newProfile.gstin}). All ${newProfile.selectedModules.length} commercial modules and ${newProfile.enabledRoles.length} RBAC roles initialized.`,
      time: 'Just now',
      read: false,
    };
    setNotifs(prev => [welcomeNotif, ...prev]);

    return ownerUser;
  };

  const markAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const unreadCount = notifs.filter(n => !n.read).length;

  const hasModule = (module: string) => {
    // If the registered company deactivated this module, it is not accessible
    if (company.selectedModules && !company.selectedModules.includes(module)) {
      return false;
    }
    return ROLE_MODULES[currentUser.role]?.includes(module) ?? false;
  };

  const hasPermission = (module: string, permission: Permission) => {
    if (company.selectedModules && !company.selectedModules.includes(module)) {
      return false;
    }
    const rolePerm = DEFAULT_ROLE_PERMISSIONS[currentUser.role]?.[module];
    if (!rolePerm) return currentUser.role === 'Business Owner';
    const baseValue = rolePerm[permission];
    const overrides = userOverrides[currentUser.id] ?? [];
    const override = overrides.find(o => o.module === module && o.permission === permission);
    return override ? override.granted : baseValue;
  };

  const setUserOverride = (userId: string, module: string, permission: Permission, granted: boolean) => {
    setUserOverrides(prev => {
      const existing = prev[userId] ?? [];
      const filtered = existing.filter(o => !(o.module === module && o.permission === permission));
      return { ...prev, [userId]: [...filtered, { module, permission, granted }] };
    });
  };

  const login = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId) || demoUsers.find(u => u.id === userId);
    if (user) { setCurrentUserState(user); setIsLoggedIn(true); }
  };

  const logout = () => setIsLoggedIn(false);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      availableUsers,
      company,
      registerCompany,
      notifications: notifs, markAllRead, unreadCount,
      hasModule, hasPermission,
      userOverrides, setUserOverride,
      isLoggedIn, login, logout,
      searchQuery, setSearchQuery,
      showSearch, setShowSearch,
      aiSidebarOpen, setAiSidebarOpen, toggleAiSidebar,
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

export { DEFAULT_ROLE_PERMISSIONS };
