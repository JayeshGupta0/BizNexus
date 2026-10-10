import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Send, Download, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AccessDenied from './AccessDenied';
import { quotations, formatCurrency, getCustomerById, getLeadById } from '../data/mockData';

export default function Quotations() {
  const { hasModule } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  if (!hasModule('quotations')) return <AccessDenied />;

  const filtered = quotations.filter(q => {
    const entity = q.customerId ? getCustomerById(q.customerId) : null;
    const lead = q.leadId ? getLeadById(q.leadId) : null;
    const name = entity?.businessName ?? lead?.companyName ?? '';
    const matchSearch = !search || q.id.toLowerCase().includes(search.toLowerCase()) || name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const accepted = quotations.filter(q => q.status === 'Accepted').length;
  const pending = quotations.filter(q => ['Draft', 'Sent', 'Viewed'].includes(q.status)).length;
  const totalValue = quotations.reduce((s, q) => s + q.total, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Quotations</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage proposals and quotations for leads and customers.</p>
        </div>
        <button onClick={() => navigate('/crm/leads')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
          <Plus size={15} /> Create Quotation
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Quotations" value={`${quotations.length}`} accent="#2563eb" />
        <KPICard title="Pending Response" value={`${pending}`} accent="#f59e0b" />
        <KPICard title="Accepted" value={`${accepted}`} accent="#16a34a" />
        <KPICard title="Total Value" value={formatCurrency(totalValue)} accent="#7c3aed" />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quotations..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none">
          {['All', 'Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Quotation ID', 'Prospect / Customer', 'Total', 'Created', 'Expiry', 'Salesperson', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(q => {
                const entity = q.customerId ? getCustomerById(q.customerId) : null;
                const lead = q.leadId ? getLeadById(q.leadId) : null;
                const entityName = entity?.businessName ?? lead?.companyName ?? 'Unknown';
                return (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-blue-600">{q.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{entityName}</div>
                      <div className="text-xs text-slate-400">{entity ? 'Customer' : 'Lead'}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(q.total)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{q.createdDate}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{q.expiryDate}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{q.salesperson}</td>
                    <td className="px-4 py-3"><StatusBadge status={q.status} dot /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {q.status === 'Draft' && <button className="p-1.5 rounded hover:bg-blue-50 text-blue-500" title="Send"><Send size={13} /></button>}
                        <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Download"><Download size={13} /></button>
                        {q.status === 'Accepted' && (
                          <button onClick={() => navigate('/sales/orders')} className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg hover:bg-green-100">
                            <ShoppingCart size={11} /> Convert
                          </button>
                        )}
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
