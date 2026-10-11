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
    <header className="h-14 flex items-center gap-3 px-4 flex-shrink-0 relative z-20" style={{ background: '#FDFAF5', borderBottom: '1px solid #E8DDD0' }}>
      {/* Mobile menu toggle */}
      <button onClick={onMenuClick} className="lg:hidden text-[#5C3A21] hover:text-[#1F130B] p-1">
        <Menu size={20} />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden sm:flex items-center gap-1.5 flex-1 text-sm min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={12} className="flex-shrink-0" style={{ color: '#C4A882' }} />}
            {crumb.path && i < breadcrumbs.length - 1 ? (
              <Link to={crumb.path} className="truncate" style={{ color: '#8B5E3C' }}>{crumb.label}</Link>
            ) : (
              <span className={`truncate font-${i === breadcrumbs.length - 1 ? 'semibold' : 'normal'}`} style={{ color: i === breadcrumbs.length - 1 ? '#1F130B' : '#8B5E3C' }}>{crumb.label}</span>
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
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8B5E3C' }} />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search customers, leads, orders..."
                className="w-72 pl-9 pr-3 py-1.5 text-sm rounded-xl focus:outline-none transition-all font-medium"
                style={{ border: '1px solid #D4BFA0', background: '#FAF7F2', color: '#1F130B' }}
              />
              {hasResults && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-xl shadow-xl overflow-hidden z-50" style={{ background: '#FDFAF5', border: '1px solid #E8DDD0' }}>
                  {searchResults!.customers.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider" style={{ color: '#8B5E3C', background: '#F5EEE4' }}>CUSTOMERS</div>
                      {searchResults!.customers.map(c => (
                        <button key={c.id} onClick={() => { navigate(`/crm/customers/${c.id}`); setShowSearch(false); setSearchQuery(''); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors" style={{ color: '#1F130B' }} onMouseEnter={e => (e.currentTarget.style.background='#F5EEE4')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: '#F5DEB3', color: '#78350F' }}>{c.businessName[0]}</div>
                          {c.businessName}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults!.leads.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider" style={{ color: '#8B5E3C', background: '#F5EEE4' }}>LEADS</div>
                      {searchResults!.leads.map(l => (
                        <button key={l.id} onClick={() => { navigate(`/crm/leads/${l.id}`); setShowSearch(false); setSearchQuery(''); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors" style={{ color: '#1F130B' }} onMouseEnter={e => (e.currentTarget.style.background='#F5EEE4')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: '#FDECD0', color: '#D97706' }}>{l.companyName[0]}</div>
                          {l.companyName}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults!.orders.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider" style={{ color: '#8B5E3C', background: '#F5EEE4' }}>ORDERS</div>
                      {searchResults!.orders.map(o => (
                        <button key={o.id} onClick={() => { navigate(`/sales/orders`); setShowSearch(false); setSearchQuery(''); }} className="w-full px-3 py-2 text-sm text-left transition-colors" style={{ color: '#5C3A21' }} onMouseEnter={e => (e.currentTarget.style.background='#F5EEE4')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>{o.id}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} style={{ color: '#8B5E3C' }} className="hover:opacity-70 transition-opacity"><X size={16} /></button>
          </div>
        ) : (
          <button onClick={() => setShowSearch(true)} className="p-2 rounded-xl transition-colors" style={{ color: '#8B5E3C' }} onMouseEnter={e => (e.currentTarget.style.background='#F0E6D8')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
            <Search size={18} />
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(v => !v); markAllRead(); }}
          className="p-2 rounded-xl transition-colors relative"
          style={{ color: '#8B5E3C' }}
          onMouseEnter={e => (e.currentTarget.style.background='#F0E6D8')}
          onMouseLeave={e => (e.currentTarget.style.background='transparent')}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: '#D97706' }}>
              {unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in" style={{ background: '#FDFAF5', border: '1px solid #E8DDD0' }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #EDE0CC' }}>
              <span className="font-bold text-sm" style={{ color: '#1F130B' }}>Notifications</span>
              <span className="text-xs" style={{ color: '#8B5E3C' }}>All caught up</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className="px-4 py-3" style={{ borderBottom: '1px solid #F0E6D8', background: n.read ? 'transparent' : '#FEF3E2' }}>
                  <div className="flex gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{notifIcons[n.type] ?? '🔔'}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold" style={{ color: '#1F130B' }}>{n.title}</div>
                      <div className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6B3F22' }}>{n.message}</div>
                      <div className="text-xs mt-1" style={{ color: '#A8795A' }}>{n.time}</div>
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

      <button className="p-2 rounded-xl transition-colors" style={{ color: '#8B5E3C' }} onMouseEnter={e => (e.currentTarget.style.background='#F0E6D8')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
        <HelpCircle size={18} />
      </button>
    </header>
  );
}
