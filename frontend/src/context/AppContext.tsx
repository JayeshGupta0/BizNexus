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
  const [currentUser, setCurrentUserState] = useState<DemoUser>(demoUsers[0]);
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [userOverrides, setUserOverrides] = useState<Record<string, UserOverride[]>>({});

  const toggleAiSidebar = () => setAiSidebarOpen(prev => !prev);

  const setCurrentUser = (user: DemoUser) => setCurrentUserState(user);

  const markAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const unreadCount = notifs.filter(n => !n.read).length;

  const hasModule = (module: string) =>
    ROLE_MODULES[currentUser.role]?.includes(module) ?? false;

  const hasPermission = (module: string, permission: Permission) => {
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
    const user = demoUsers.find(u => u.id === userId);
    if (user) { setCurrentUserState(user); setIsLoggedIn(true); }
  };

  const logout = () => setIsLoggedIn(false);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
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
