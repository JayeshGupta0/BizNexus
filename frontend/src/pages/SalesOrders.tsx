import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, ShoppingCart, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { salesOrders, formatCurrency, getCustomerById, getProductById } from '../data/mockData';

export default function SalesOrders() {
  const { hasModule, hasPermission } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);

  if (!hasModule('sales-orders')) return <AccessDenied />;

  const filtered = salesOrders.filter(o => {
    const customer = getCustomerById(o.customerId);
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || customer?.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.fulfillmentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = salesOrders.reduce((s, o) => s + o.total, 0);
  const pending = salesOrders.filter(o => o.fulfillmentStatus === 'Confirmed' || o.fulfillmentStatus === 'Processing').length;
  const completed = salesOrders.filter(o => o.fulfillmentStatus === 'Delivered').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Sales Orders</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage orders from your business customers.</p>
        </div>
        <div className="flex gap-2">
          {hasPermission('sales-orders', 'export') && (
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"><Download size={14} /> Export</button>
          )}
          {hasPermission('sales-orders', 'create') && (
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
              <Plus size={15} /> Create Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Total Orders" value={`${salesOrders.length}`} accent="#2563eb" />
        <KPICard title="Pending" value={`${pending}`} accent="#f59e0b" />
        <KPICard title="Processing" value={`${salesOrders.filter(o => o.fulfillmentStatus === 'Processing').length}`} accent="#7c3aed" />
        <KPICard title="Delivered" value={`${completed}`} accent="#16a34a" />
        <KPICard title="Total Value" value={formatCurrency(totalValue)} change="+18.4%" changeDir="up" accent="#2563eb" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none">
          {['All', 'Draft', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Date', 'Salesperson', 'Payment', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(order => {
                const customer = getCustomerById(order.customerId);
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-medium text-blue-600">{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{customer?.businessName}</div>
                      <div className="text-xs text-slate-400">{customer?.customerType}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{order.items.length} items</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{order.orderDate}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{order.salesperson}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td>
                    <td className="px-4 py-3"><StatusBadge status={order.fulfillmentStatus} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create Sales Order" subtitle="New order for a customer" size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600">Cancel</button>
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600">Save as Draft</button>
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{ background: '#2563eb' }}>Confirm Order</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Customer</label>
              <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                {['Select customer...', ...['Acme Corporation', 'NovaTech Industries', 'Apex Retail', 'Vertex Solutions']].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Salesperson</label>
              <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                {['Rahul Sharma', 'Priya Shah'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Products</label>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Product</th><th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Price</th><th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Qty</th><th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Disc %</th></tr></thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2"><select className="text-sm border border-slate-200 rounded px-2 py-1 bg-white"><option>Enterprise CRM Suite</option><option>Business Analytics Pro</option><option>AI Assistant Pro</option><option>Cloud ERP Package</option></select></td>
                    <td className="px-3 py-2 text-right text-slate-600">₹48,000</td>
                    <td className="px-3 py-2 text-right"><input type="number" defaultValue={1} className="w-12 text-right border border-slate-200 rounded px-1 py-0.5 text-xs" /></td>
                    <td className="px-3 py-2 text-right"><input type="number" defaultValue={5} className="w-12 text-right border border-slate-200 rounded px-1 py-0.5 text-xs" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="mt-2 text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"><Plus size={12} /> Add Product</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Billing Address</label>
              <textarea rows={2} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500" placeholder="Billing address..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Shipping Address</label>
              <textarea rows={2} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500" placeholder="Shipping address..." />
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-end gap-1 text-sm">
            <div className="flex justify-between w-48"><span className="text-slate-500">Subtotal:</span><span className="font-medium">₹48,000</span></div>
            <div className="flex justify-between w-48"><span className="text-slate-500">Discount (5%):</span><span className="font-medium text-red-600">-₹2,400</span></div>
            <div className="flex justify-between w-48"><span className="text-slate-500">GST (18%):</span><span className="font-medium">₹8,208</span></div>
            <div className="flex justify-between w-48 border-t border-slate-200 pt-1 mt-1"><span className="font-semibold text-slate-800">Total:</span><span className="font-bold text-slate-900">₹53,808</span></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
