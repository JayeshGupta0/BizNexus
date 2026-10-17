import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import AccessDenied from './AccessDenied';
import {
  revenueTrend, leadTrend, leadsBySource, salesByRegion, revenueByCategory,
  conversionFunnel, campaigns, products, formatCurrency,
} from '../data/mockData';

import { BarChart2 } from 'lucide-react';

const PERIODS = ['Today', '7 Days', '30 Days', '3 Months', '6 Months', '1 Year', 'Custom'];
const SECTIONS = ['Sales', 'CRM', 'Marketing', 'Inventory', 'Finance'];
const PIE_COLORS = ['#2563eb', '#7c3aed', '#16a34a', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const { hasModule, authMode, salesOrders } = useApp();
  const [period, setPeriod] = useState('6 Months');
  const [section, setSection] = useState('Sales');

  if (!hasModule('analytics')) return <AccessDenied />;

  const isRealClean = authMode === 'real' && salesOrders.length === 0;

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <div className="font-semibold text-slate-600 mb-1">{label}</div>
        {payload.map((p: any) => <div key={p.name} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: p.color }} /><span className="text-slate-600">{p.name}: <strong>{typeof p.value === 'number' && p.value > 10000 ? formatCurrency(p.value) : p.value}</strong></span></div>)}
      </div>
    );
  };

  const salesBySalesPerson = [
    { name: 'Rahul Sharma', revenue: 2840000, leads: 42 },
    { name: 'Priya Shah', revenue: 1620000, leads: 38 },
    { name: 'Arjun Mehta', revenue: 1800000, leads: 8 },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1 text-sm">Business intelligence and performance insights across all modules.</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl flex-wrap">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${period === p ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${section === s ? 'text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`} style={section === s ? { background: '#2563eb' } : {}}>
            {s}
          </button>
        ))}
      </div>

      {isRealClean ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center my-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <BarChart2 size={24} />
          </div>
          <h3 className="font-semibold text-slate-800 text-base">Analytics Workspace Active</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Your enterprise analytics engine is clean and connected to SQLite. Because this workspace is freshly registered, business trends and graphs will appear dynamically as you process orders, register leads, and record financial transactions.
          </p>
        </div>
      ) : (
        <>
      {/* ── Sales Analytics ────────────────────────────────────────────── */}
      {section === 'Sales' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Total Revenue" value={formatCurrency(revenueTrend.reduce((s, r) => s + r.revenue, 0))} change="+18.4%" changeDir="up" accent="#2563eb" />
            <KPICard title="Net Profit" value={formatCurrency(revenueTrend.reduce((s, r) => s + r.profit, 0))} change="+24.8%" changeDir="up" accent="#16a34a" />
            <KPICard title="Avg Order Value" value="₹67,619" change="+8.2%" changeDir="up" accent="#7c3aed" />
            <KPICard title="Revenue Growth" value="+18.4%" accent="#f59e0b" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="ar1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
                  <Tooltip content={customTooltip} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#ar1)" />
                  <Area type="monotone" dataKey="profit" name="Profit" stroke="#16a34a" strokeWidth={2} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Sales by Region</h3>
              <div className="space-y-3">
                {salesByRegion.map((r, i) => {
                  const pct = Math.round((r.value / salesByRegion[0].value) * 100);
                  return (
                    <div key={r.region}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">{r.region}</span>
                        <span className="font-semibold text-slate-700">{formatCurrency(r.value)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-4">Sales by Team Member</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={salesBySalesPerson}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── CRM Analytics ──────────────────────────────────────────────── */}
      {section === 'CRM' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Total Leads" value="242" change="+48 this month" changeDir="up" accent="#2563eb" />
            <KPICard title="Qualified" value="126" change="+26" changeDir="up" accent="#7c3aed" />
            <KPICard title="Conversion Rate" value="16%" change="+2.1%" changeDir="up" accent="#16a34a" />
            <KPICard title="Pipeline Value" value="₹34.8L" change="+12.6%" changeDir="up" accent="#f59e0b" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Lead Growth</h3>
              <ResponsiveContainer width="100%" height={200}>
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
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Lead Sources</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={leadsBySource} cx="50%" cy="50%" outerRadius={75} dataKey="value" nameKey="source" paddingAngle={2}>
                    {leadsBySource.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-4">Conversion Funnel</h3>
            <div className="space-y-2">
              {conversionFunnel.map(stage => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <div className="w-24 text-xs font-medium text-slate-600 text-right">{stage.stage}</div>
                  <div className="flex-1 h-8 rounded-xl overflow-hidden bg-slate-100 relative">
                    <div className="h-full rounded-xl flex items-center justify-end pr-3" style={{ width: `${stage.pct}%`, background: '#2563eb', opacity: 0.5 + (stage.pct / 100) * 0.5 }}>
                      <span className="text-white text-xs font-bold">{stage.count}</span>
                    </div>
                  </div>
                  <div className="w-12 text-xs text-slate-400">{stage.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Marketing Analytics ────────────────────────────────────────── */}
      {section === 'Marketing' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Active Campaigns" value={`${campaigns.filter(c => c.status === 'Active').length}`} accent="#2563eb" />
            <KPICard title="Total Leads" value={`${campaigns.reduce((s, c) => s + c.leads, 0)}`} accent="#7c3aed" />
            <KPICard title="Avg ROI" value={`${(campaigns.reduce((s, c) => s + c.roi, 0) / campaigns.length).toFixed(1)}×`} accent="#16a34a" />
            <KPICard title="Revenue Attributed" value={formatCurrency(campaigns.reduce((s, c) => s + c.revenue, 0))} accent="#f59e0b" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-4">Campaign Performance</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={campaigns.map(c => ({ name: c.name.split(' ').slice(0, 2).join(' '), leads: c.leads, revenue: c.revenue / 100000, roi: c.roi }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="leads" name="Leads" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Revenue (L)" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── Inventory Analytics ────────────────────────────────────────── */}
      {section === 'Inventory' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Inventory Value" value="₹1.04Cr" accent="#2563eb" />
            <KPICard title="Units Available" value="285" accent="#16a34a" />
            <KPICard title="Stock Turnover" value="4.2×" accent="#7c3aed" />
            <KPICard title="Reorder Required" value="2" changeDir="down" accent="#dc2626" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-4">Units Sold by Product</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={products.map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), sold: p.unitsSold, stock: p.currentStock }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="sold" name="Units Sold" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stock" name="Current Stock" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── Finance Analytics ──────────────────────────────────────────── */}
      {section === 'Finance' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Total Revenue" value={formatCurrency(revenueTrend.reduce((s, r) => s + r.revenue, 0))} change="+18.4%" changeDir="up" accent="#2563eb" />
            <KPICard title="Total Expenses" value={formatCurrency(revenueTrend.reduce((s, r) => s + r.expenses, 0))} accent="#f59e0b" />
            <KPICard title="Net Profit" value={formatCurrency(revenueTrend.reduce((s, r) => s + r.profit, 0))} change="+24.8%" changeDir="up" accent="#16a34a" />
            <KPICard title="Profit Margin" value="47.2%" change="+3.1%" changeDir="up" accent="#7c3aed" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-4">Revenue, Expenses & Profit</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="fp1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                  <linearGradient id="fp2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
                <Tooltip content={customTooltip} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2} fill="url(#fp1)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#16a34a" strokeWidth={2} fill="url(#fp2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      </>
      )}
    </div>
  );
}
