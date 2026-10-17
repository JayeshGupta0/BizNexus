import { useNavigate } from 'react-router';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import AIInsightCard from '../components/ui/AIInsightCard';
import AccessDenied from './AccessDenied';
import { revenueTrend as demoRevenueTrend, formatCurrency, getCustomerById as mockGetCustomerById } from '../data/mockData';

const demoReceivablesAging = [
  { bucket: 'Current', amount: 262800 },
  { bucket: '1-30 days', amount: 184080 },
  { bucket: '31-60 days', amount: 267120 },
  { bucket: '61+ days', amount: 87778 },
];

export default function Finance() {
  const { hasModule, invoices, payments, expenses, customers, authMode } = useApp();
  const navigate = useNavigate();

  if (!hasModule('finance')) return <AccessDenied />;

  const isRealClean = authMode === 'real' && invoices.length === 0 && expenses.length === 0;

  const totalRevenue = authMode === 'demo'
    ? demoRevenueTrend[demoRevenueTrend.length - 1].revenue
    : invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

  const totalExpenses = authMode === 'demo'
    ? demoRevenueTrend[demoRevenueTrend.length - 1].expenses
    : expenses.reduce((s, e) => s + e.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const receivables = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
  const totalExpenseAmount = expenses.filter(e => e.status === 'Approved').reduce((s, e) => s + e.amount, 0);

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <div className="font-semibold text-slate-600 mb-1">{label}</div>
        {payload.map((p: any) => <div key={p.name} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: p.color }} /><span className="text-slate-600">{p.name}: <strong>{formatCurrency(p.value)}</strong></span></div>)}
      </div>
    );
  };

  const getCustomer = (id: string) => customers.find(c => c.id === id) || (authMode === 'demo' ? mockGetCustomerById(id) : undefined);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Finance</h1>
          <p className="text-slate-500 mt-1 text-sm">Revenue, expenses, receivables, and cash flow overview.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/finance/invoices')} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Invoices <ChevronRight size={13} /></button>
          <button onClick={() => navigate('/finance/payments')} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Payments <ChevronRight size={13} /></button>
          <button onClick={() => navigate('/finance/expenses')} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Expenses <ChevronRight size={13} /></button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Revenue" value={formatCurrency(totalRevenue)} change={!isRealClean ? "+18.4%" : undefined} changeDir="up" icon={<TrendingUp size={16} />} accent="#2563eb" />
        <KPICard title="Expenses" value={formatCurrency(totalExpenses)} change={!isRealClean ? "+10.6%" : undefined} changeDir="down" icon={<TrendingDown size={16} />} accent="#f59e0b" />
        <KPICard title="Net Profit" value={formatCurrency(netProfit)} change={!isRealClean ? "+24.8%" : undefined} changeDir="up" icon={<DollarSign size={16} />} accent="#16a34a" />
        <KPICard title="Receivables" value={formatCurrency(receivables)} icon={<DollarSign size={16} />} accent="#7c3aed" />
        <KPICard title="Overdue" value={formatCurrency(overdue)} change={overdue > 0 ? "Outstanding" : undefined} changeDir="down" icon={<TrendingDown size={16} />} accent="#dc2626" />
        <KPICard title="Approved Expenses" value={formatCurrency(totalExpenseAmount)} accent="#64748b" />
      </div>

      {isRealClean ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <DollarSign size={36} className="mx-auto mb-2 text-slate-300" />
          <h3 className="font-semibold text-slate-700 text-sm">Financial Ledgers Ready</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            No transactions recorded yet. Invoices, incoming payments, and operational expenses created will populate your financial graphs and ageing summaries here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Revenue vs Expenses</h3>
            <p className="text-xs text-slate-400 mb-4">Comparison overview</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={demoRevenueTrend}>
                <defs>
                  <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                  <linearGradient id="exp2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
                <Tooltip content={customTooltip} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2} fill="url(#rev2)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" strokeWidth={2} fill="url(#exp2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Receivables Aging</h3>
            <p className="text-xs text-slate-400 mb-4">Outstanding invoice ageing buckets</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={demoReceivablesAging}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/100000).toFixed(1)}L`} />
                <Tooltip formatter={(v) => [formatCurrency(v as number), 'Amount']} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {demoReceivablesAging.map((_, i) => <Cell key={i} fill={i === 0 ? '#16a34a' : i === 1 ? '#f59e0b' : i === 2 ? '#f97316' : '#dc2626'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">Recent Invoices</h3>
          <button onClick={() => navigate('/finance/invoices')} className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-100">{['Invoice', 'Customer', 'Amount', 'Due Date', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-xs">
                    No invoices recorded yet.
                  </td>
                </tr>
              ) : (
                invoices.slice(0, 5).map(inv => {
                  const customer = getCustomer(inv.customerId);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-blue-600">{inv.id}</td>
                      <td className="px-4 py-3 text-slate-700">{customer?.businessName || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(inv.amount)}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{inv.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : inv.status === 'Partially Paid' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{inv.status}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isRealClean && (
        <AIInsightCard
          insight="₹4.2L in invoices are overdue. Vertex Solutions (₹2.67L) is 18 days past due — immediate follow-up recommended. Greenfield Co. has ₹95K outstanding with irregular payment history. Cash flow is strong with ₹18.2L available."
        />
      )}
    </div>
  );
}
