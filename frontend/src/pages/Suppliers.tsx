import { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AccessDenied from './AccessDenied';
import { suppliers, formatCurrency } from '../data/mockData';

export default function Suppliers() {
  const { hasModule } = useApp();

  if (!hasModule('suppliers')) return <AccessDenied />;

  const totalPurchase = suppliers.reduce((s, sup) => s + sup.totalPurchase, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage supplier relationships and performance.</p>
        </div>
        {useApp().hasPermission('suppliers', 'create') && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
            <Plus size={15} /> Add Supplier
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Suppliers" value={`${suppliers.length}`} accent="#2563eb" />
        <KPICard title="Active" value={`${suppliers.filter(s => s.status === 'Active').length}`} accent="#16a34a" />
        <KPICard title="Total Purchases" value={formatCurrency(totalPurchase)} accent="#7c3aed" />
        <KPICard title="Avg Rating" value="4.5/5" accent="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {suppliers.map(sup => (
          <div key={sup.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-lg font-bold flex-shrink-0">
                  {sup.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{sup.name}</div>
                  <div className="text-xs text-slate-400">{sup.category}</div>
                </div>
              </div>
              <StatusBadge status={sup.status} />
            </div>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={13} className={i <= Math.floor(sup.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
              ))}
              <span className="text-xs text-slate-500 ml-1">{sup.rating}/5</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-slate-400">Contact</div><div className="text-slate-700">{sup.contactPerson}</div></div>
              <div><div className="text-xs text-slate-400">Lead Time</div><div className="text-slate-700">{sup.leadTime} days</div></div>
              <div><div className="text-xs text-slate-400">Total Orders</div><div className="font-medium text-slate-800">{sup.totalOrders}</div></div>
              <div><div className="text-xs text-slate-400">Total Purchase</div><div className="font-medium text-slate-800">{formatCurrency(sup.totalPurchase)}</div></div>
              {sup.outstanding > 0 && (
                <div className="col-span-2"><div className="text-xs text-slate-400">Outstanding</div><div className="font-medium text-red-600">{formatCurrency(sup.outstanding)}</div></div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-400 mb-1">Products supplied</div>
              <div className="flex flex-wrap gap-1">
                {sup.products.slice(0, 2).map(p => <span key={p} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{p.split(' ').slice(0, 2).join(' ')}</span>)}
                {sup.products.length > 2 && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{sup.products.length - 2}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
