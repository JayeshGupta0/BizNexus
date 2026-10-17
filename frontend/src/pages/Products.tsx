import { useState } from 'react';
import { Plus, Search, PackageOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type Product } from '../data/mockData';

export default function Products() {
  const { hasModule, hasPermission, products, addProduct, suppliers, authMode } = useApp();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const getInitialForm = () => ({
    name: '',
    sku: '',
    category: 'Packaged Food',
    price: '',
    cost: '',
    currentStock: authMode === 'real' ? '' : '50',
    reorderLevel: authMode === 'real' ? '' : '20',
    description: '',
  });
  const [form, setForm] = useState(getInitialForm());

  if (!hasModule('products')) return <AccessDenied />;

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = products.filter(p => p.status === 'Active').length;
  const lowStock = products.filter(p => p.status === 'Low Stock').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
  const categories = [...new Set(products.map(p => p.category))].length;

  const handleSaveProduct = () => {
    if (!form.name || !form.price) return;
    const priceNum = Number(form.price) || 0;
    const costNum = Number(form.cost) || Math.round(priceNum * 0.7);
    const stockNum = Number(form.currentStock) || 0;
    const reorderNum = Number(form.reorderLevel) || 10;

    const newProd: Product = {
      id: `p-${Date.now()}`,
      name: form.name.trim(),
      sku: form.sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      category: form.category,
      price: priceNum,
      cost: costNum,
      currentStock: stockNum,
      reorderLevel: reorderNum,
      status: stockNum === 0 ? 'Out of Stock' : stockNum <= reorderNum ? 'Low Stock' : 'Active',
      supplierId: suppliers[0]?.id || 'sup-1',
      description: form.description.trim() || `${form.name} product entry`,
    };

    addProduct(newProd);
    setForm(getInitialForm());
    setAddOpen(false);
  };

  const handleOpenAdd = () => {
    setForm(getInitialForm());
    setAddOpen(true);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your product catalogue and pricing.</p>
        </div>
        {hasPermission('products', 'create') && (
          <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
            <Plus size={15} /> Add Product
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Products" value={`${products.length}`} accent="#2563eb" />
        <KPICard title="Active" value={`${activeCount}`} accent="#16a34a" />
        <KPICard title="Low Stock" value={`${lowStock + outOfStock}`} change={outOfStock > 0 ? `${outOfStock} out of stock` : ''} changeDir="down" accent="#f59e0b" />
        <KPICard title="Categories" value={`${categories}`} accent="#7c3aed" />
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['SKU', 'Product', 'Category', 'Price', 'Cost', 'Margin', 'Stock', 'Reorder Level', 'Supplier', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                    <PackageOpen size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No products found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {products.length === 0 ? 'Your product catalogue is empty. Click "+ Add Product" to get started.' : 'Try adjusting your search criteria.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const supplier = suppliers.find(s => s.id === p.supplierId);
                  const margin = p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.sku}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-400 max-w-48 truncate">{p.description}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{p.category}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-3 text-slate-500">{formatCurrency(p.cost)}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-green-600">{margin}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${p.currentStock === 0 ? 'text-red-600' : p.currentStock <= p.reorderLevel ? 'text-amber-600' : 'text-slate-700'}`}>
                          {p.currentStock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{p.reorderLevel}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{supplier?.name ?? '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} dot /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Product" subtitle="Add a new product to the catalogue" size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600">Cancel</button>
            <button onClick={handleSaveProduct} disabled={!form.name || !form.price} className="px-4 py-2 text-sm text-white rounded-xl font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>Save Product</button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Product Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Premium Basmati Rice 5kg" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">SKU</label>
            <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. FNB-RIC-001" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Dairy / Beverage / Snacks" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Selling Price (₹) *</label>
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="450" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Cost Price (₹)</label>
            <input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="320" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Initial Stock Quantity</label>
            <input type="number" value={form.currentStock} onChange={e => setForm({ ...form, currentStock: e.target.value })} placeholder="100" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500" placeholder="Product details..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
