import { useNavigate } from 'react-router';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Users, Target, DollarSign, Package, AlertTriangle,
  ShoppingCart, Sparkles, ArrowRight, Clock, ChevronRight,
  BarChart2, PlusCircle, FileText, Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import AIInsightCard from '../components/ui/AIInsightCard';
import StatusBadge from '../components/ui/StatusBadge';
import {
  revenueTrend, leadTrend, salesByRegion, revenueByCategory,
  leads, customers, salesOrders, products, invoices,
  formatCurrency, getCustomerById,
} from '../data/mockData';

const GREETINGS = ['Good morning', 'Good afternoon', 'Good evening'];
const greeting = GREETINGS[Math.floor(new Date().getHours() / 8)];

const ROLE_INSIGHTS: Record<string, string> = {
  'Business Owner': 'Revenue increased 18.4% this month, primarily driven by enterprise accounts and distributor sales. Nova Distributor is in final negotiation — close probability 75%.',
  'Sales Manager': 'Team pipeline value is ₹34.8L with 3 deals in negotiation. Conversion rate improved 2.1% over last month. Rahul\'s team is outperforming targets by 12%.',
  'Sales Executive': 'You have 4 active leads and 2 follow-ups due today. Acme Retail Prospect\'s quotation was viewed yesterday — good time to reconnect.',
  'Marketing Manager': 'LinkedIn campaigns are generating fewer leads but higher-value opportunities (avg ₹4.8L vs ₹2.2L for Instagram). Wholesale Partner Campaign ROI is 3.9×.',
  'Inventory Manager': 'Business Analytics Pro is below reorder level (8 units). Inventory Management Module is out of stock — PO-0482 expected Sep 15.',
  'Purchase Manager': 'PO-0483 sent to TechSource India, expected Sep 10. 2 purchase orders pending acknowledgement. Supplier TechSource India is rated 4.8/5.',
  'Finance Manager': '₹4.2L in invoices are overdue. Vertex Solutions (₹2.67L) is 18 days past due. Cash flow position is strong: ₹18.2L available.',
  'Business Analyst': 'Revenue growth is 18.4% MoM. Lead conversion rate improved to 16%. LinkedIn B2B campaign shows 7.2× ROI vs 3.9× for Instagram.',
};

export default function Dashboard() {
  const { currentUser, hasModule, authMode } = useApp();
  const navigate = useNavigate();
  const isRealClean = authMode === 'real';

  const isOwner = currentUser.role === 'Business Owner';
  const isSalesMgr = currentUser.role === 'Sales Manager';
  const isSalesExec = currentUser.role === 'Sales Executive';
  const isMarketing = currentUser.role === 'Marketing Manager';
  const isInventory = currentUser.role === 'Inventory Manager';
  const isPurchase = currentUser.role === 'Purchase Manager';
  const isFinance = currentUser.role === 'Finance Manager';
  const isAnalyst = currentUser.role === 'Business Analyst';

  const totalRevenue = salesOrders.reduce((s, o) => s + o.total, 0);
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
  const lowStock = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
  const activeLeads = leads.filter(l => !['Won', 'Lost'].includes(l.stage)).length;
  const pipelineValue = leads.filter(l => !['Won', 'Lost'].includes(l.stage)).reduce((s, l) => s + l.potentialValue, 0);

  const recentLeads = leads.filter(l => !['Won', 'Lost'].includes(l.stage)).slice(0, 4);
  const recentOrders = salesOrders.slice(0, 4);
  const topCustomers = customers.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 4);
  const lowStockProducts = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock');

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-lg text-xs">
        <div className="font-semibold text-slate-600 mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-600">{p.name}:</span>
            <span className="font-medium">{typeof p.value === 'number' && p.value > 10000 ? formatCurrency(p.value) : p.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Clean workspace welcome state for newly registered companies
  if (isRealClean) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              {greeting}, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Welcome to your new BizNexus workspace. Start by adding your data below.</p>
          </div>
          <button onClick={() => navigate('/ai-assistant')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90" style={{ background: '#7c3aed' }}>
            <Sparkles size={15} /> Ask AI
          </button>
        </div>

        {/* Empty-state onboarding cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {hasModule('leads') && (
            <button onClick={() => navigate('/crm/leads')} className="group bg-white rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 p-6 text-left transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <Target size={20} className="text-blue-600" />
              </div>
              <div className="font-semibold text-slate-800 text-sm">Add your first Lead</div>
              <div className="text-xs text-slate-400 mt-1">Track prospects and pipeline opportunities</div>
              <div className="flex items-center gap-1 text-xs text-blue-600 font-medium mt-3">
                <PlusCircle size={12} /> Get started
              </div>
            </button>
          )}
          {hasModule('customers') && (
            <button onClick={() => navigate('/crm/customers')} className="group bg-white rounded-2xl border-2 border-dashed border-emerald-200 hover:border-emerald-400 p-6 text-left transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                <Users size={20} className="text-emerald-600" />
              </div>
              <div className="font-semibold text-slate-800 text-sm">Add your first Customer</div>
              <div className="text-xs text-slate-400 mt-1">Manage customer accounts and revenue</div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-3">
                <PlusCircle size={12} /> Get started
              </div>
            </button>
          )}
          {hasModule('products') && (
            <button onClick={() => navigate('/products')} className="group bg-white rounded-2xl border-2 border-dashed border-amber-200 hover:border-amber-400 p-6 text-left transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                <Package size={20} className="text-amber-600" />
              </div>
              <div className="font-semibold text-slate-800 text-sm">Add your first Product</div>
              <div className="text-xs text-slate-400 mt-1">Catalog your food & beverage products</div>
              <div className="flex items-center gap-1 text-xs text-amber-600 font-medium mt-3">
                <PlusCircle size={12} /> Get started
              </div>
            </button>
          )}
          {hasModule('sales-orders') && (
            <button onClick={() => navigate('/sales/orders')} className="group bg-white rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 p-6 text-left transition-all hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <ShoppingCart size={20} className="text-purple-600" />
              </div>
              <div className="font-semibold text-slate-800 text-sm">Create your first Sales Order</div>
              <div className="text-xs text-slate-400 mt-1">Process orders and track fulfillment</div>
              <div className="flex items-center gap-1 text-xs text-purple-600 font-medium mt-3">
                <PlusCircle size={12} /> Get started
              </div>
            </button>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Invite Team Member', icon: <Users size={15} />, path: '/users-roles', color: 'text-blue-600 bg-blue-50' },
              { label: 'Create Invoice', icon: <FileText size={15} />, path: '/finance/invoices', color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Manage Inventory', icon: <Layers size={15} />, path: '/inventory', color: 'text-amber-600 bg-amber-50' },
              { label: 'View Analytics', icon: <BarChart2 size={15} />, path: '/analytics', color: 'text-purple-600 bg-purple-50' },
            ].map(q => (
              <button key={q.path} onClick={() => navigate(q.path)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors text-left">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${q.color}`}>{q.icon}</span>
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <AIInsightCard
          insight="Your workspace is ready! Start by adding leads, customers, and products. Once you have data, this dashboard will show live KPIs, charts, and AI-powered insights tailored to your business."
          onAskAI={() => navigate('/ai-assistant')}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {greeting}, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {isOwner && "Here's what's happening across your business."}
            {isSalesMgr && "Here's your team's sales performance today."}
            {isSalesExec && "Here are your leads and tasks for today."}
            {isMarketing && "Here's your marketing and campaign performance."}
            {isInventory && "Here's your inventory status overview."}
            {isPurchase && "Here's your procurement dashboard."}
            {isFinance && "Here's your financial overview."}
            {isAnalyst && "Here's your business intelligence summary."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/ai-assistant')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90" style={{ background: '#7c3aed' }}>
            <Sparkles size={15} /> Ask AI
          </button>
          {hasModule('analytics') && (
            <button onClick={() => navigate('/analytics')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
              View Analytics <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── BUSINESS OWNER / FULL DASHBOARD ────────────────────────────── */}
      {(isOwner || isAnalyst) && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard title="Total Revenue" value={formatCurrency(totalRevenue)} change="+18.4%" changeDir="up" changeLabel="vs last month"
              icon={<DollarSign size={18} />} accent="#2563eb" onClick={() => navigate('/finance')} />
            <KPICard title="Active Leads" value={`${activeLeads}`} change="+8" changeDir="up" changeLabel="this week"
              icon={<Target size={18} />} accent="#f59e0b" onClick={() => navigate('/crm/leads')} />
            <KPICard title="Customers" value={`${customers.length}`} change="+2" changeDir="up" changeLabel="this month"
              icon={<Users size={18} />} accent="#16a34a" onClick={() => navigate('/crm/customers')} />
            <KPICard title="Pipeline Value" value={formatCurrency(pipelineValue)} change="+12.6%" changeDir="up"
              icon={<TrendingUp size={18} />} accent="#7c3aed" onClick={() => navigate('/crm/leads')} />
            <KPICard title="Outstanding" value={formatCurrency(overdueInvoices)} change="3 invoices" changeDir="down"
              icon={<DollarSign size={18} />} accent="#dc2626" onClick={() => navigate('/finance/invoices')} />
            <KPICard title="Inventory Value" value="₹1.04Cr" change="-4.2%" changeDir="down" changeLabel="low stock alert"
              icon={<Package size={18} />} accent="#f59e0b" onClick={() => navigate('/inventory')} />
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Revenue & Expenses Trend</h3>
                  <p className="text-xs text-slate-400">Last 6 months</p>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+18.4% MoM</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
                  <Tooltip content={customTooltip} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2} fill="url(#revGrad)" />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" strokeWidth={2} fill="url(#expGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-1">Revenue by Category</h3>
              <p className="text-xs text-slate-400 mb-4">Product mix this year</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={revenueByCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                    {revenueByCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-2 shadow-lg text-xs">
                        <div className="font-medium text-slate-700">{payload[0].name}</div>
                        <div className="text-slate-500">{formatCurrency(payload[0].value as number)}</div>
                      </div>
                    ) : null
                  } />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {revenueByCategory.slice(0, 3).map(c => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                      <span className="text-slate-600 truncate max-w-[100px]">{c.name}</span>
                    </div>
                    <span className="font-medium text-slate-700">{formatCurrency(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-1">Lead Generation Trend</h3>
              <p className="text-xs text-slate-400 mb-4">New, qualified & converted leads</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={leadTrend} barSize={10} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={customTooltip} />
                  <Bar dataKey="new" name="New" fill="#bfdbfe" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="qualified" name="Qualified" fill="#60a5fa" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="converted" name="Converted" fill="#2563eb" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-1">Sales by Region</h3>
              <p className="text-xs text-slate-400 mb-4">Revenue distribution</p>
              <div className="space-y-3">
                {salesByRegion.map((r, i) => {
                  const pct = Math.round((r.value / salesByRegion[0].value) * 100);
                  return (
                    <div key={r.region}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">{r.region}</span>
                        <span className="font-medium text-slate-700">{formatCurrency(r.value)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: i === 0 ? '#2563eb' : i === 1 ? '#7c3aed' : `hsl(${210 + i * 20}, 80%, 60%)` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SALES MANAGER DASHBOARD ──────────────────────────────────────── */}
      {isSalesMgr && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Pipeline Value" value={formatCurrency(pipelineValue)} change="+12.6%" changeDir="up" icon={<TrendingUp size={18} />} accent="#2563eb" />
            <KPICard title="Active Leads" value={`${activeLeads}`} change="+8" changeDir="up" icon={<Target size={18} />} accent="#f59e0b" />
            <KPICard title="Customers" value={`${customers.length}`} change="+2" changeDir="up" icon={<Users size={18} />} accent="#16a34a" />
            <KPICard title="Monthly Revenue" value={formatCurrency(salesOrders.reduce((s, o) => s + o.total, 0))} change="+18.4%" changeDir="up" icon={<DollarSign size={18} />} accent="#7c3aed" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-4">Lead Generation Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={leadTrend}>
                <defs>
                  <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={customTooltip} />
                <Area type="monotone" dataKey="new" name="New Leads" stroke="#2563eb" strokeWidth={2} fill="url(#lg1)" />
                <Area type="monotone" dataKey="converted" name="Converted" stroke="#16a34a" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── SALES EXECUTIVE ──────────────────────────────────────────────── */}
      {isSalesExec && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="My Leads" value={`${leads.filter(l => l.assignedTo === currentUser.name && !['Won','Lost'].includes(l.stage)).length}`} icon={<Target size={18} />} accent="#f59e0b" />
          <KPICard title="Follow-ups Due" value="2" change="Today" changeDir="down" icon={<Clock size={18} />} accent="#dc2626" />
          <KPICard title="My Quotations" value="3" icon={<ShoppingCart size={18} />} accent="#2563eb" />
          <KPICard title="Won This Month" value="1" change="+₹4.8L" changeDir="up" icon={<TrendingUp size={18} />} accent="#16a34a" />
        </div>
      )}

      {/* ── INVENTORY MANAGER ────────────────────────────────────────────── */}
      {isInventory && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Inventory Value" value="₹1.04Cr" icon={<Package size={18} />} accent="#2563eb" />
            <KPICard title="Total SKUs" value={`${products.length}`} icon={<Package size={18} />} accent="#16a34a" />
            <KPICard title="Low Stock" value={`${lowStock}`} change="Action needed" changeDir="down" icon={<AlertTriangle size={18} />} accent="#f59e0b" />
            <KPICard title="Out of Stock" value={`${products.filter(p => p.status === 'Out of Stock').length}`} change="Critical" changeDir="down" icon={<AlertTriangle size={18} />} accent="#dc2626" />
          </div>
        </>
      )}

      {/* ── FINANCE MANAGER ──────────────────────────────────────────────── */}
      {isFinance && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard title="Monthly Revenue" value={formatCurrency(totalRevenue)} change="+18.4%" changeDir="up" icon={<DollarSign size={18} />} accent="#2563eb" />
          <KPICard title="Receivables" value={formatCurrency(invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0))} icon={<TrendingUp size={18} />} accent="#f59e0b" />
          <KPICard title="Overdue" value={formatCurrency(overdueInvoices)} change="3 invoices" changeDir="down" icon={<AlertTriangle size={18} />} accent="#dc2626" />
        </div>
      )}

      {/* ── Bottom sections (shared where relevant) ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Insight */}
        <div className="lg:col-span-3">
          <AIInsightCard
            insight={ROLE_INSIGHTS[currentUser.role] ?? ''}
            onViewAnalysis={hasModule('analytics') ? () => navigate('/analytics') : undefined}
            onAskAI={() => navigate('/ai-assistant')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Recent Leads */}
        {hasModule('leads') && (
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Recent Leads</h3>
              <button onClick={() => navigate('/crm/leads')} className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentLeads.map(lead => (
                <button key={lead.id} onClick={() => navigate(`/crm/leads/${lead.id}`)} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-left transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold flex-shrink-0">
                    {lead.companyName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{lead.companyName}</div>
                    <div className="text-xs text-slate-400">{lead.leadType} · {lead.source}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-700">{formatCurrency(lead.potentialValue)}</div>
                    <StatusBadge status={lead.stage} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Top Customers */}
        {hasModule('customers') && (
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Top Customers</h3>
              <button onClick={() => navigate('/crm/customers')} className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {topCustomers.map(c => (
                <button key={c.id} onClick={() => navigate(`/crm/customers/${c.id}`)} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-left transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                    {c.businessName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{c.businessName}</div>
                    <div className="text-xs text-slate-400">{c.customerType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-700">{formatCurrency(c.totalRevenue)}</div>
                    <StatusBadge status={c.status} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {hasModule('sales-orders') && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Recent Orders</h3>
              <button onClick={() => navigate('/sales/orders')} className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentOrders.map(order => {
                const customer = getCustomerById(order.customerId);
                return (
                  <div key={order.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">{order.id}</span>
                        <StatusBadge status={order.fulfillmentStatus} />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{customer?.businessName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-700">{formatCurrency(order.total)}</div>
                      <StatusBadge status={order.paymentStatus} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(hasModule('inventory') || hasModule('products')) && lowStockProducts.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-500" />
                <h3 className="font-semibold text-slate-800 text-sm">Stock Alerts</h3>
              </div>
              <button onClick={() => navigate('/inventory')} className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">View inventory <ChevronRight size={12} /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800">{p.name}</div>
                    <div className="text-xs text-slate-400">SKU: {p.sku} · Reorder: {p.reorderLevel}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-700">{p.currentStock} units</div>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
