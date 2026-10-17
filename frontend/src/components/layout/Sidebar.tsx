import { Link, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  LayoutDashboard, Users, Target, ShoppingCart, FileText, Package,
  Warehouse, ShoppingBag, Truck, CreditCard, Receipt, TrendingUp,
  Share2, BarChart3, FolderOpen, Bot, Shield, Settings, ChevronDown,
  ChevronRight, Zap, UserCheck, X, Menu, LogOut,
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
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, hasModule, availableUsers, company, logout } = useApp();
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
        style={{ background: '#120904' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-white text-sm bg-gradient-to-br from-[#D97706] to-[#EA580C] shadow-md shadow-orange-950/40">
            {company.companyName ? company.companyName.charAt(0).toUpperCase() : 'B'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display font-bold text-white text-sm leading-tight truncate">
              {company.companyName || 'BizNexus'}
            </div>
            <div className="text-[10px] mt-0.5 truncate text-amber-300/80 font-mono">
              {company.tenantId ? `${company.tenantId}` : 'Enterprise Portal'}
            </div>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-stone-400 hover:text-white">
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
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: '#6B3F22' }}>
                  {group.group}
                </div>
                {visible.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm mb-0.5 transition-all duration-150
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-[#D97706]/20 to-[#EA580C]/10 text-amber-300 font-semibold border border-amber-500/20'
                        : 'text-stone-400 hover:bg-white/[0.05] hover:text-stone-200'
                      }
                    `}
                  >
                    <span className={isActive(item.path) ? 'text-amber-400' : 'text-stone-500'}>{item.icon}</span>
                    {item.label}
                    {item.module === 'ai-assistant' && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#78350F', color: '#FCD34D' }}>AI</span>
                    )}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Demo Role Switcher */}
        <div className="px-3 py-3 border-t border-white/10 bg-black/20">
          <button
            onClick={() => setRoleOpen(v => !v)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-gradient-to-br from-[#B45309] to-[#EA580C]">
              {currentUser.avatar}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-white text-xs font-medium truncate">{currentUser.name}</div>
              <div className="text-[11px] truncate text-amber-300/80">{currentUser.role}</div>
            </div>
            {roleOpen ? <ChevronDown size={14} className="text-stone-400 flex-shrink-0" /> : <ChevronRight size={14} className="text-stone-400 flex-shrink-0" />}
          </button>

          {roleOpen && (
            <div className="mt-1 rounded-xl overflow-hidden border border-white/10 animate-fade-in bg-[#1A0F08] shadow-2xl">
              <div className="px-3 py-2 border-b border-white/10 bg-black/30">
                <div className="flex items-center gap-1.5">
                  <UserCheck size={12} className="text-[#F59E0B]" />
                  <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                    SWITCH PORTAL ROLE
                  </span>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto py-1">
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => { setCurrentUser(user); setRoleOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-white/5 transition-colors ${
                      currentUser.id === user.id ? 'text-[#F59E0B] bg-white/[0.04]' : 'text-stone-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 bg-[#332218]">
                      {user.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{user.name}</div>
                      <div className="text-[10px] text-stone-400 truncate">{user.role}</div>
                    </div>
                    {currentUser.id === user.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F59E0B] flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full mt-2.5 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 transition-all cursor-pointer shadow-xs"
            title="Sign out of enterprise workspace"
          >
            <LogOut size={13} className="text-rose-400" />
            <span>Sign Out / Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
