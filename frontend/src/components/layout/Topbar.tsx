import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router';
import { Bell, Search, HelpCircle, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { customers, leads, products, salesOrders, invoices, documents } from '../../data/mockData';

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/crm/leads': 'Leads & Pipeline',
  '/crm/customers': 'Customers',
  '/sales/orders': 'Sales Orders',
  '/sales/quotations': 'Quotations',
  '/inventory/products': 'Products',
  '/inventory': 'Inventory',
  '/purchases': 'Purchases',
  '/suppliers': 'Suppliers',
  '/finance': 'Finance',
  '/finance/invoices': 'Invoices',
  '/finance/payments': 'Payments',
  '/finance/expenses': 'Expenses',
  '/marketing/social': 'Social Content',
  '/marketing/campaigns': 'Campaigns',
  '/analytics': 'Analytics',
  '/documents': 'Documents',
  '/ai-assistant': 'AI Assistant',
  '/settings/users': 'Users & Roles',
  '/settings': 'Settings',
};

const SECTION_MAP: Record<string, string> = {
  '/crm': 'CRM',
  '/sales': 'Sales',
  '/inventory': 'Inventory',
  '/purchases': 'Procurement',
  '/suppliers': 'Procurement',
  '/finance': 'Finance',
  '/marketing': 'Marketing',
  '/analytics': 'Intelligence',
  '/documents': 'Intelligence',
  '/ai-assistant': 'Intelligence',
  '/settings': 'System',
};

function getBreadcrumbs(pathname: string): { label: string; path?: string }[] {
  const crumbs: { label: string; path?: string }[] = [{ label: 'Home', path: '/dashboard' }];
  const section = Object.entries(SECTION_MAP).find(([k]) => pathname.startsWith(k));
  if (section) crumbs.push({ label: section[1] });
  const page = BREADCRUMB_MAP[pathname];
  if (page) crumbs.push({ label: page });
  else {
    const base = pathname.replace(/\/[^/]+$/, '');
    const basePage = BREADCRUMB_MAP[base];
    if (basePage) {
      crumbs.push({ label: basePage, path: base });
      crumbs.push({ label: 'Detail' });
    }
  }
  return crumbs;
}

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAllRead,
    searchQuery,
    setSearchQuery,
    showSearch,
    setShowSearch,
    aiSidebarOpen,
    toggleAiSidebar,
  } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const breadcrumbs = getBreadcrumbs(location.pathname);

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const searchResults = searchQuery.trim().length > 1 ? {
    customers: customers.filter(c => c.businessName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    leads: leads.filter(l => l.companyName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    orders: salesOrders.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2),
    products: products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2),
    invoices: invoices.filter(i => i.id.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2),
  } : null;

  const hasResults = searchResults && Object.values(searchResults).some(r => r.length > 0);

  const notifIcons: Record<string, string> = {
    lead: '🎯', invoice: '📄', stock: '📦', campaign: '📢', quotation: '📝', order: '🛒', payment: '💳',
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4 flex-shrink-0 relative z-20">
      {/* Mobile menu toggle */}
      <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-700 p-1">
        <Menu size={20} />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden sm:flex items-center gap-1.5 flex-1 text-sm min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />}
            {crumb.path && i < breadcrumbs.length - 1 ? (
              <Link to={crumb.path} className="text-slate-500 hover:text-slate-700 truncate">{crumb.label}</Link>
            ) : (
              <span className={i === breadcrumbs.length - 1 ? 'text-slate-800 font-medium truncate' : 'text-slate-500'}>{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="flex-1 lg:hidden" />

      {/* Search */}
      <div className="relative">
        {showSearch ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search customers, leads, orders..."
                className="w-72 pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {hasResults && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                  {searchResults!.customers.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-50">CUSTOMERS</div>
                      {searchResults!.customers.map(c => (
                        <button key={c.id} onClick={() => { navigate(`/crm/customers/${c.id}`); setShowSearch(false); setSearchQuery(''); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">{c.businessName[0]}</div>
                          {c.businessName}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults!.leads.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-50">LEADS</div>
                      {searchResults!.leads.map(l => (
                        <button key={l.id} onClick={() => { navigate(`/crm/leads/${l.id}`); setShowSearch(false); setSearchQuery(''); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                          <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-600">{l.companyName[0]}</div>
                          {l.companyName}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults!.orders.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-50">ORDERS</div>
                      {searchResults!.orders.map(o => (
                        <button key={o.id} onClick={() => { navigate(`/sales/orders`); setShowSearch(false); setSearchQuery(''); }} className="w-full px-3 py-2 text-sm hover:bg-slate-50 text-left text-slate-700">{o.id}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
        ) : (
          <button onClick={() => setShowSearch(true)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <Search size={18} />
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(v => !v); markAllRead(); }}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fade-in">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-sm">Notifications</span>
              <span className="text-xs text-slate-400">All caught up</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 ${n.read ? '' : 'bg-blue-50/50'}`}>
                  <div className="flex gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{notifIcons[n.type] ?? '🔔'}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-800">{n.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</div>
                      <div className="text-xs text-slate-400 mt-1">{n.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BN AI Toggle Button */}
      <button
        onClick={toggleAiSidebar}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          aiSidebarOpen
            ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-600/30'
            : 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 hover:bg-purple-100 border-purple-200 shadow-xs'
        }`}
        title={aiSidebarOpen ? 'Close BN AI Panel' : 'Open BN AI Panel'}
        aria-label="Toggle BN AI side panel"
      >
        <Sparkles size={14} className={aiSidebarOpen ? 'text-white' : 'text-purple-600'} />
        <span className="font-semibold">BN AI</span>
      </button>

      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
        <HelpCircle size={18} />
      </button>
    </header>
  );
}
