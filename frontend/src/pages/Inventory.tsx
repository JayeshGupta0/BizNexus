import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, Warehouse, Plus, Search, AlertTriangle, Layers, Filter, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AIInsightCard from '../components/ui/AIInsightCard';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type Product } from '../data/mockData';

const FB_PALETTE: Record<string, string> = {
  'Instant Foods & Noodles': '#ea580c',
  'Coffee & Beverages': '#b45309',
  'Confectionery & Chocolates': '#dc2626',
  'Dairy & Nutrition': '#16a34a',
  'Infant Nutrition': '#7c3aed',
  'Beverages & Tea': '#059669',
  'General Food & Beverage': '#2563eb',
};

export default function Inventory() {
  const { hasModule, hasPermission, products, suppliers, addProduct, authMode } = useApp();
  const [activeTab, setActiveTab] = useState<'inventory' | 'products'>('inventory');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addOpen, setAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Add Product Form State
  const getInitialFormData = () => authMode === 'real' ? {
    name: '',
    sku: '',
    category: '',
    packaging: '',
    price: 0,
    cost: 0,
    currentStock: 0,
    reorderLevel: 0,
    supplierId: suppliers[0]?.id || '',
    description: '',
  } : {
    name: 'Maggi Special Atta Masala Noodles (Pack of 12)',
    sku: 'NEST-MAG-ATT-012',
    category: 'Instant Foods & Noodles',
    packaging: 'Pack of 12 (72g each)',
    price: 1440,
    cost: 980,
    currentStock: 1200,
    reorderLevel: 250,
    supplierId: suppliers[0]?.id || 's1',
    description: 'Whole wheat flour noodles fortified with dietary fibre and authentic Indian spices.',
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const handleOpenAdd = () => {
    setFormData(getInitialFormData());
    setAddOpen(true);
  };

  if (!hasModule('inventory') && !hasModule('products')) return <AccessDenied />;

  const getSupplier = (id: string) => suppliers.find(s => s.id === id);

  const totalValue = products.reduce((s, p) => s + p.price * p.currentStock, 0);
  const totalItems = products.reduce((s, p) => s + p.currentStock, 0);
  const lowStock = products.filter(p => p.status === 'Low Stock').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
  const categoriesList = ['All', ...new Set(products.map(p => p.category))];

  // Dynamic Category Valuation Calculation for F&B
  const categoryMap: Record<string, number> = {};
  products.forEach(p => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + p.price * p.currentStock;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value], i) => ({
    name: name.length > 18 ? name.slice(0, 16) + '...' : name,
    fullName: name,
    value,
    fill: FB_PALETTE[name] || '#64748b',
  }));

  const filteredProducts = products.filter(p => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleSaveProduct = () => {
    if (!formData.name.trim() || !formData.sku.trim()) {
      alert('Product name and SKU are required');
      return;
    }

    const newProd: Product = {
      id: `p-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      category: formData.category,
      description: formData.description,
      price: Number(formData.price) || 0,
      cost: Number(formData.cost) || 0,
      currentStock: Number(formData.currentStock) || 0,
      reorderLevel: Number(formData.reorderLevel) || 0,
      supplierId: formData.supplierId || (suppliers[0]?.id ?? 's1'),
      status: Number(formData.currentStock) === 0 ? 'Out of Stock' : Number(formData.currentStock) <= Number(formData.reorderLevel) ? 'Low Stock' : 'Active',
      unitsSold: 0,
    };

    addProduct(newProd);
    setAddOpen(false);
    setToastMessage(`Product SKU "${newProd.sku}" registered in catalogue successfully.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="p-6 space-y-5">
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-md animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Inventory & Products</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Food & Beverage inventory management, warehouse batch allocation, and product catalog.
          </p>
        </div>
        {(hasPermission('inventory', 'create') || hasPermission('products', 'create')) && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition-all hover:opacity-90 cursor-pointer"
            style={{ background: '#2563eb' }}
          >
            <Plus size={15} /> Add Product SKU
          </button>
        )}
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Inventory Valuation" value={formatCurrency(totalValue)} change="-2.4%" changeDir="down" accent="#2563eb" />
        <KPICard title="Total SKUs" value={`${products.length}`} accent="#7c3aed" />
        <KPICard title="Stocked Units" value={`${totalItems.toLocaleString()}`} accent="#16a34a" />
        <KPICard title="Low Stock" value={`${lowStock}`} changeDir="down" change="Reorder soon" accent="#f59e0b" />
        <KPICard title="Stockout Risk" value={`${outOfStock}`} changeDir="down" change="Immediate Action" accent="#dc2626" />
      </div>

      {/* Analytics & AI Insight Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Food & Beverage Stock Valuation by Category</h3>
            <span className="text-xs text-slate-400">Total: {formatCurrency(totalValue)}</span>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip formatter={(v) => [formatCurrency(v as number), 'Inventory Value']} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {categoryData.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-slate-400">
              No product stock registered yet. Add SKUs to see categorised valuation.
            </div>
          )}
        </div>

        <AIInsightCard
          insight={
            products.length > 0
              ? 'Nescafé Classic 500g and Maggi 2-Minute Noodles lead total FMCG dispatch volume. KitKat 4-Finger stock is nearing minimum threshold across Bhiwandi Central DC. Dairy procurement order PO-0482 with Amul GCMMF has been confirmed for expected receiving on Oct 18.'
              : 'Workspace inventory is initialized and awaiting catalog setup. Configure your primary Food & Beverage product lines to begin tracking stock movements, warehouse allotments, and batch expirations.'
          }
        />
      </div>

      {/* View Switcher, Search & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Warehouse size={14} /> Stock & Warehouses
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package size={14} /> F&B Catalogue & Pricing
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search SKU, product or category..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
            >
              {categoriesList.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">Catalogue is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Your registered company currently has no products configured. Add your first food or beverage SKU to track inventory.
            </p>
            {(hasPermission('inventory', 'create') || hasPermission('products', 'create')) && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90"
                style={{ background: '#2563eb' }}
              >
                <Plus size={14} /> Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Product SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Name & Line</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Wholesale Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Unit Cost</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Current Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Procurement Partner</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map(p => {
                  const supplier = getSupplier(p.supplierId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium">{p.sku}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{p.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-3 text-right text-slate-500 text-xs">{formatCurrency(p.cost)}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-bold ${
                            p.currentStock === 0
                              ? 'text-red-600'
                              : p.currentStock <= p.reorderLevel
                              ? 'text-amber-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {p.currentStock.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{supplier?.name ?? 'Direct FMCG Hub'}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={p.status} dot />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Product */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Food & Beverage Product SKU"
        subtitle="Register a new packaged food SKU with wholesale pricing and inventory allocation"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddOpen(false)}
              className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProduct}
              className="px-4 py-2 text-sm text-white rounded-xl font-medium shadow-sm hover:opacity-90 cursor-pointer"
              style={{ background: '#2563eb' }}
            >
              Save Product & Allocate
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Product Name *</label>
            <input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Maggi Special Atta Masala Noodles (Pack of 12)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">SKU Code *</label>
            <input
              value={formData.sku}
              onChange={e => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g. NEST-MAG-012"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">{authMode === 'real' ? 'Category' : 'Food & Beverage Category'}</label>
            {authMode === 'real' ? (
              <input
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Electronics, Apparel, FMCG, Pharma..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            ) : (
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="Instant Foods & Noodles">Instant Foods & Noodles</option>
                <option value="Coffee & Beverages">Coffee & Beverages</option>
                <option value="Confectionery & Chocolates">Confectionery & Chocolates</option>
                <option value="Dairy & Nutrition">Dairy & Nutrition</option>
                <option value="Infant Nutrition">Infant Nutrition</option>
                <option value="Beverages & Tea">Beverages & Tea</option>
                <option value="General Food & Beverage">General Food & Beverage</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Packaging Unit / Format</label>
            <input
              value={formData.packaging}
              onChange={e => setFormData({ ...formData, packaging: e.target.value })}
              placeholder="e.g. Pack of 24 (70g each)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Wholesale Selling Price (₹) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Production / Procurement Cost (₹)</label>
            <input
              type="number"
              value={formData.cost}
              onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Initial Stock Allocation</label>
            <input
              type="number"
              value={formData.currentStock}
              onChange={e => setFormData({ ...formData, currentStock: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Reorder Level Threshold</label>
            <input
              type="number"
              value={formData.reorderLevel}
              onChange={e => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Raw Material / Supply Partner</label>
            <select
              value={formData.supplierId}
              onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              {suppliers.length > 0 ? (
                suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))
              ) : (
                <option value="" disabled>No suppliers registered — Add a Supplier first</option>
              )}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Nutritional & Specification Notes</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
              placeholder="FSSAI standard batch details, ingredients, shelf life..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
