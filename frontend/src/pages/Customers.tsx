import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Filter, Download, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { customers, formatCurrency } from '../data/mockData';

const CUSTOMER_TYPES = ['All', 'Retailer', 'Wholesaler', 'Distributor', 'Business', 'Enterprise'] as const;
const STATUSES = ['All', 'Active', 'Inactive', 'At Risk'] as const;

export default function Customers() {
  const { hasModule, hasPermission } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [addOpen, setAddOpen] = useState(false);

  if (!hasModule('customers')) return <AccessDenied />;

  const filtered = customers.filter(c => {
    const matchSearch = !search || c.businessName.toLowerCase().includes(search.toLowerCase()) || c.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || c.customerType === typeFilter;
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalRevenue = customers.reduce((s, c) => s + c.totalRevenue, 0);
  const activeCount = customers.filter(c => c.status === 'Active').length;
  const totalOutstanding = customers.reduce((s, c) => s + c.outstanding, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your business accounts and client relationships.</p>
        </div>
        <div className="flex gap-2">
          {hasPermission('customers', 'export') && (
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
              <Download size={14} /> Export
            </button>
          )}
          {hasPermission('customers', 'create') && (
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
              <Plus size={15} /> Add Customer
            </button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Business Accounts" value={`${customers.length}`} change="+2 this month" changeDir="up" accent="#2563eb" />
        <KPICard title="Active Customers" value={`${activeCount}`} accent="#16a34a" />
        <KPICard title="Customer Revenue" value={formatCurrency(totalRevenue)} change="+18.4%" changeDir="up" accent="#7c3aed" />
        <KPICard title="Outstanding" value={formatCurrency(totalOutstanding)} change="3 overdue" changeDir="down" accent="#dc2626" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
          {CUSTOMER_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Business', 'Type', 'Contact Person', 'Location', 'Orders', 'Revenue', 'Outstanding', 'Last Purchase', 'Account Owner', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/crm/customers/${c.id}`)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold flex-shrink-0">
                        {c.businessName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{c.businessName}</div>
                        <div className="text-xs text-slate-400">{c.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700">{c.customerType}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.contactPerson}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{c.location}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{c.totalOrders}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(c.totalRevenue)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${c.outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {c.outstanding > 0 ? formatCurrency(c.outstanding) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{c.lastPurchase}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{c.accountOwner}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} dot /></td>
                  <td className="px-4 py-3">
                    <button className="text-slate-300 hover:text-blue-500 transition-colors" onClick={e => { e.stopPropagation(); navigate(`/crm/customers/${c.id}`); }}>
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">No customers found. Try adjusting your filters.</div>
        )}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">{filtered.length} of {customers.length} customers</span>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Customer" subtitle="Create a new business account" size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600">Cancel</button>
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{ background: '#2563eb' }}>Create Account</button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Business Name', placeholder: 'e.g. Acme Corporation' },
            { label: 'Contact Person', placeholder: 'Full name' },
            { label: 'Email', placeholder: 'contact@company.com' },
            { label: 'Phone', placeholder: '+91 98765 43210' },
            { label: 'Location', placeholder: 'City, State' },
            { label: 'Website', placeholder: 'www.company.com' },
            { label: 'Tax ID / GSTIN', placeholder: 'GST number' },
            { label: 'Industry', placeholder: 'e.g. Technology Distribution' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{f.label}</label>
              <input placeholder={f.placeholder} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Customer Type</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
              {['Retailer', 'Wholesaler', 'Distributor', 'Business', 'Enterprise'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Account Owner</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
              {['Rahul Sharma', 'Priya Shah'].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
