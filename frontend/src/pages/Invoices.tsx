import { useState } from 'react';
import { Plus, Search, Download, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AccessDenied from './AccessDenied';
import { invoices, formatCurrency, getCustomerById } from '../data/mockData';

export default function Invoices() {
  const { hasModule } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  if (!hasModule('invoices')) return <AccessDenied />;

  const filtered = invoices.filter(inv => {
    const customer = getCustomerById(inv.customerId);
    const matchSearch = !search || inv.id.toLowerCase().includes(search.toLowerCase()) || customer?.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paid = invoices.filter(i => i.status === 'Paid').length;
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
  const totalAmount = invoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-500 mt-1 text-sm">Track and manage customer invoices and payments.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"><Download size={14} /> Export</button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}><Plus size={15} /> New Invoice</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Invoices" value={`${invoices.length}`} accent="#2563eb" />
        <KPICard title="Paid" value={`${paid}`} accent="#16a34a" />
        <KPICard title="Overdue Amount" value={formatCurrency(overdue)} change="3 invoices" changeDir="down" accent="#dc2626" />
        <KPICard title="Total Value" value={formatCurrency(totalAmount)} accent="#7c3aed" />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none">
          {['All', 'Draft', 'Sent', 'Paid', 'Partially Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Invoice ID', 'Customer', 'Amount', 'Issue Date', 'Due Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(inv => {
                const customer = getCustomerById(inv.customerId);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-blue-600">{inv.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{customer?.businessName ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{inv.issueDate}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={inv.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-slate-500'}>{inv.dueDate}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} dot /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Send"><Send size={13} /></button>
                        <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Download"><Download size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
