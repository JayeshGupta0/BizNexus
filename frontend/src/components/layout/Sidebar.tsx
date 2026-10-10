import { Link, useLocation } from 'react-router';
import { useState } from 'react';
import {
  LayoutDashboard, Users, Target, ShoppingCart, FileText, Package,
  Warehouse, ShoppingBag, Truck, CreditCard, Receipt, TrendingUp,
  Share2, BarChart3, FolderOpen, Bot, Shield, Settings, ChevronDown,
  ChevronRight, Zap, UserCheck, X, Menu,
} from 'lucide-react';
import { useApp, ROLE_MODULES } from '../../context/AppContext';
import { demoUsers } from '../../data/mockData';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  module: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} />, module: 'dashboard' },
    ],
  },
  {
    group: 'CRM',
    items: [
      { label: 'Leads & Pipeline', path: '/crm/leads', icon: <Target size={16} />, module: 'leads' },
      { label: 'Customers', path: '/crm/customers', icon: <Users size={16} />, module: 'customers' },
    ],
  },
  {
    group: 'SALES',
    items: [
      { label: 'Sales Orders', path: '/sales/orders', icon: <ShoppingCart size={16} />, module: 'sales-orders' },
      { label: 'Quotations', path: '/sales/quotations', icon: <FileText size={16} />, module: 'quotations' },
    ],
  },
  {
    group: 'INVENTORY',
    items: [
      { label: 'Inventory', path: '/inventory', icon: <Warehouse size={16} />, module: 'inventory' },
    ],
  },
  {
    group: 'PROCUREMENT',
    items: [
      { label: 'Purchases', path: '/purchases', icon: <ShoppingBag size={16} />, module: 'purchases' },
      { label: 'Suppliers', path: '/suppliers', icon: <Truck size={16} />, module: 'suppliers' },
    ],
  },
  {
    group: 'FINANCE',
    items: [
      { label: 'Finance', path: '/finance', icon: <TrendingUp size={16} />, module: 'finance' },
      { label: 'Invoices', path: '/finance/invoices', icon: <Receipt size={16} />, module: 'invoices' },
      { label: 'Payments', path: '/finance/payments', icon: <CreditCard size={16} />, module: 'payments' },
      { label: 'Expenses', path: '/finance/expenses', icon: <ShoppingBag size={16} />, module: 'expenses' },
    ],
  },
  {
    group: 'MARKETING',
    items: [
      { label: 'Social Content', path: '/marketing/social', icon: <Share2 size={16} />, module: 'social-content' },
      { label: 'Campaigns', path: '/marketing/campaigns', icon: <Zap size={16} />, module: 'campaigns' },
    ],
  },
  {
    group: 'INTELLIGENCE',
    items: [
      { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={16} />, module: 'analytics' },
      { label: 'Documents', path: '/documents', icon: <FolderOpen size={16} />, module: 'documents' },
      { label: 'AI Assistant', path: '/ai-assistant', icon: <Bot size={16} />, module: 'ai-assistant' },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { label: 'Users & Roles', path: '/settings/users', icon: <Shield size={16} />, module: 'users-roles' },
      { label: 'Settings', path: '/settings', icon: <Settings size={16} />, module: 'settings' },
    ],
  },
];

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const location = useLocation();
  const { currentUser, setCurrentUser, hasModule } = useApp();
  const [roleOpen, setRoleOpen] = useState(false);

  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === '/' || location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 z-40 flex flex-col transition-transform duration-200
          lg:relative lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: '#0f172a' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-white text-sm" style={{ background: '#2563eb' }}>
            B
          </div>
          <div>
            <div className="font-display font-bold text-white text-base leading-none">BizNexuz</div>
            <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>Intelligent Business Platform</div>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_GROUPS.map(group => {
            const visible = group.items.filter(item =>
              item.module === 'dashboard' || hasModule(item.module)
            );
            if (!visible.length) return null;
            return (
              <div key={group.group} className="mb-1">
                <div className="px-3 py-1.5 text-xs font-semibold tracking-wider" style={{ color: '#475569' }}>
                  {group.group}
                </div>
                {visible.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors
                      ${isActive(item.path)
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    {item.icon}
                    {item.label}
                    {item.module === 'ai-assistant' && (
                      <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: '#7c3aed', color: '#ede9fe' }}>AI</span>
                    )}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Demo Role Switcher */}
        <div className="px-3 py-3 border-t border-white/10">
          <button
            onClick={() => setRoleOpen(v => !v)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: '#2563eb' }}>
              {currentUser.avatar}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-white text-xs font-medium truncate">{currentUser.name}</div>
              <div className="text-xs truncate" style={{ color: '#64748b' }}>{currentUser.role}</div>
            </div>
            {roleOpen ? <ChevronDown size={14} className="text-slate-400 flex-shrink-0" /> : <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />}
          </button>

          {roleOpen && (
            <div className="mt-1 rounded-lg overflow-hidden border border-white/10 animate-fade-in" style={{ background: '#1e293b' }}>
              <div className="px-3 py-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <UserCheck size={12} className="text-blue-400" />
                  <span className="text-xs font-semibold text-slate-400">DEMO MODE — SWITCH ROLE</span>
                </div>
              </div>
              {demoUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => { setCurrentUser(user); setRoleOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-white/5 transition-colors
                    ${currentUser.id === user.id ? 'text-blue-400' : 'text-slate-300'}`}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: '#334155' }}>
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{user.name}</div>
                    <div className="text-slate-500 truncate">{user.role}</div>
                  </div>
                  {currentUser.id === user.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
