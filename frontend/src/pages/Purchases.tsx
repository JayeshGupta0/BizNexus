import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AccessDenied from './AccessDenied';
import { purchaseOrders, formatCurrency, getSupplierById, getProductById } from '../data/mockData';

export default function Purchases() {
  const { hasModule } = useApp();
  const [search, setSearch] = useState('');

  if (!hasModule('purchases')) return <AccessDenied />;

  const filtered = purchaseOrders.filter(po => {
    const supplier = getSupplierById(po.supplierId);
    return !search || po.id.toLowerCase().includes(search.toLowerCase()) || supplier?.name.toLowerCase().includes(search.toLowerCase());
  });

  const totalValue = purchaseOrders.reduce((s, po) => s + po.total, 0);
  const pending = purchaseOrders.filter(po => ['Draft', 'Sent'].includes(po.status)).length;
  const confirmed = purchaseOrders.filter(po => po.status === 'Confirmed').length;
  const received = purchaseOrders.filter(po => po.status === 'Received').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Purchases</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage purchase orders and supplier procurement.</p>
        </div>
        {useApp().hasPermission('purchases', 'create') && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
            <Plus size={15} /> Create PO
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Purchase Orders" value={`${purchaseOrders.length}`} accent="#2563eb" />
        <KPICard title="Pending" value={`${pending}`} accent="#f59e0b" />
        <KPICard title="Confirmed" value={`${confirmed}`} accent="#7c3aed" />
        <KPICard title="Received" value={`${received}`} accent="#16a34a" />
        <KPICard title="Total Value" value={formatCurrency(totalValue)} accent="#2563eb" />
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search POs..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['PO Number', 'Supplier', 'Items', 'Amount', 'Order Date', 'Expected Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(po => {
                const supplier = getSupplierById(po.supplierId);
                return (
                  <tr key={po.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{po.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{supplier?.name}</div>
                      <div className="text-xs text-slate-400">{supplier?.category}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{po.items.length} items</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(po.total)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{po.orderDate}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{po.expectedDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={po.status} dot /></td>
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
