import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, Warehouse, Plus, Search, AlertTriangle, Layers, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AIInsightCard from '../components/ui/AIInsightCard';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { products, formatCurrency, getSupplierById } from '../data/mockData';

const inventoryRows = [
  { productId: 'p1', warehouse: 'Mumbai WH', reserved: 12, movement: '+8/day' },
  { productId: 'p2', warehouse: 'Mumbai WH', reserved: 3, movement: '+4/day' },
  { productId: 'p3', warehouse: 'Bangalore WH', reserved: 0, movement: '-' },
  { productId: 'p4', warehouse: 'Mumbai WH', reserved: 8, movement: '+3/day' },
  { productId: 'p5', warehouse: 'Delhi WH', reserved: 5, movement: '+2/day' },
];

const categoryData = [
  { name: 'CRM', value: 7200000, fill: '#2563eb' },
  { name: 'Analytics', value: 2232000, fill: '#7c3aed' },
  { name: 'AI', fill: '#8b5cf6', value: 5100000 },
  { name: 'ERP', value: 3528000, fill: '#16a34a' },
  { name: 'Ops', value: 0, fill: '#f59e0b' },
];

export default function Inventory() {
  const { hasModule, hasPermission } = useApp();
  const [activeTab, setActiveTab] = useState<'inventory' | 'products'>('inventory');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addOpen, setAddOpen] = useState(false);

  if (!hasModule('inventory') && !hasModule('products')) return <AccessDenied />;

  const totalValue = products.reduce((s, p) => s + p.price * p.currentStock, 0);
  const totalItems = products.reduce((s, p) => s + p.currentStock, 0);
  const lowStock = products.filter(p => p.status === 'Low Stock').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
  const categoriesList = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Inventory & Products</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Unified stock level management, warehouse allocations, and product catalogue.
          </p>
        </div>
        {(hasPermission('inventory', 'create') || hasPermission('products', 'create')) && (
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm transition-all hover:bg-blue-700"
            style={{ background: '#2563eb' }}
          >
            <Plus size={15} /> Add Product
          </button>
        )}
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Inventory Value" value={formatCurrency(totalValue)} change="-4.2%" changeDir="down" accent="#2563eb" />
        <KPICard title="Total SKUs" value={`${products.length}`} accent="#7c3aed" />
        <KPICard title="Total Units" value={`${totalItems}`} accent="#16a34a" />
        <KPICard title="Low Stock" value={`${lowStock}`} changeDir="down" change="Action needed" accent="#f59e0b" />
        <KPICard title="Out of Stock" value={`${outOfStock}`} changeDir="down" change="Critical" accent="#dc2626" />
      </div>

      {/* Analytics & AI Insight Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Stock Valuation by Category</h3>
            <span className="text-xs text-slate-400">Total: {formatCurrency(totalValue)}</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${(v / 100000).toFixed(0)}L`}
              />
              <Tooltip formatter={(v) => [formatCurrency(v as number), 'Value']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {categoryData.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <AIInsightCard
          insight="Business Analytics Pro may reach reorder level within 8 days at current depletion rate. Inventory Management Module is currently out of stock — PO-0482 is in Confirmed status with expected supplier delivery on Sep 15. Cloud ERP Package maintains healthy stock for 14+ weeks."
        />
      </div>

      {/* View Switcher, Search & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Tab buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'inventory'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Warehouse size={14} /> Stock & Warehouses
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package size={14} /> Product Catalogue & Pricing
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products or SKU..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
              <Filter size={12} className="text-slate-400" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 text-xs font-medium cursor-pointer"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View 1: Stock & Warehouses Table */}
        {activeTab === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-left">Warehouse</th>
                  <th className="px-4 py-3 text-center">Current Stock</th>
                  <th className="px-4 py-3 text-center">Reserved</th>
                  <th className="px-4 py-3 text-center">Available</th>
                  <th className="px-4 py-3 text-center">Reorder Level</th>
                  <th className="px-4 py-3 text-center">Daily Movement</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map(product => {
                  const row = inventoryRows.find(r => r.productId === product.id) ?? {
                    warehouse: 'Central WH',
                    reserved: 0,
                    movement: '+1/day',
                  };
                  const available = product.currentStock - row.reserved;
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Package size={14} />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">{product.name}</div>
                            <div className="text-[11px] text-slate-400">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">{product.sku}</td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{row.warehouse}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-bold ${
                            product.currentStock === 0
                              ? 'text-red-600'
                              : product.currentStock <= product.reorderLevel
                              ? 'text-amber-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {product.currentStock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-500">{row.reserved}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800">{available}</td>
                      <td className="px-4 py-3 text-center text-slate-500">{product.reorderLevel}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-semibold ${
                            row.movement === '-' ? 'text-slate-400' : 'text-emerald-600'
                          }`}
                        >
                          {row.movement}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={product.status} dot />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* View 2: Product Catalogue & Pricing Table */}
        {activeTab === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-left">Product Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-right">Selling Price</th>
                  <th className="px-4 py-3 text-right">Unit Cost</th>
                  <th className="px-4 py-3 text-center">Margin</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-left">Primary Supplier</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map(p => {
                  const supplier = getSupplierById(p.supplierId);
                  const margin = Math.round(((p.price - p.cost) / p.price) * 100);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">{p.sku}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-400 max-w-48 truncate">{p.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">{formatCurrency(p.cost)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {margin}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-bold ${
                            p.currentStock === 0
                              ? 'text-red-600'
                              : p.currentStock <= p.reorderLevel
                              ? 'text-amber-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {p.currentStock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{supplier?.name ?? '—'}</td>
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
        title="Add Product"
        subtitle="Register a new SKU and allocate initial stock"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddOpen(false)}
              className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setAddOpen(false)}
              className="px-4 py-2 text-sm text-white rounded-xl font-medium shadow-sm hover:bg-blue-700"
              style={{ background: '#2563eb' }}
            >
              Save Product & Allocate
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Product Name', placeholder: 'e.g. Enterprise CRM Suite' },
            { label: 'SKU', placeholder: 'BNX-XXX-000' },
            { label: 'Category', placeholder: 'e.g. Software' },
            { label: 'Price (₹)', placeholder: '48000' },
            { label: 'Cost (₹)', placeholder: '18000' },
            { label: 'Reorder Level', placeholder: '20' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{f.label}</label>
              <input
                placeholder={f.placeholder}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
              placeholder="Module description and key specifications..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
