import { useState } from 'react';
import { Plus, Star, Search, Truck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type Supplier } from '../data/mockData';

export default function Suppliers() {
  const { hasModule, hasPermission, suppliers, addSupplier, authMode } = useApp();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Add Supplier Form
  const getInitialFormData = () => authMode === 'real' ? {
    name: '',
    category: 'Dairy Ingredients',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: 'Net 30',
    taxId: '',
  } : {
    name: 'Gujarat Co-operative Milk Marketing Federation (Amul)',
    category: 'Dairy Ingredients',
    contactPerson: 'R.S. Sodhi',
    email: 'procurement@amul.coop',
    phone: '+91 2692 258506',
    address: 'Amul Dairy Road, Anand, Gujarat 388001',
    paymentTerms: 'Net 30',
    taxId: '24AAACG1234F1Z8',
  };

  const [formData, setFormData] = useState(getInitialFormData());

  if (!hasModule('suppliers')) return <AccessDenied />;

  const filtered = suppliers.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  const totalPurchase = suppliers.reduce((s, sup) => s + sup.totalPurchase, 0);

  const avgRatingDisplay = authMode === 'real' || suppliers.length === 0
    ? '0/5'
    : (suppliers.reduce((s, sup) => s + (sup.rating || 0), 0) / suppliers.length).toFixed(1) + ' / 5';

  const handleOpenAdd = () => {
    setFormData(getInitialFormData());
    setAddOpen(true);
  };

  const handleAddSupplier = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Supplier name and email are required');
      return;
    }

    const newSup: Supplier = {
      id: `s-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      category: formData.category,
      contactPerson: formData.contactPerson.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      status: 'Active',
      rating: 0,
      totalOrders: 0,
      totalPurchase: 0,
      outstanding: 0,
      products: [],
      paymentTerms: formData.paymentTerms,
      leadTime: 7,
      taxId: formData.taxId,
      notes: 'Approved food ingredient vendor with verified FSSAI standards.',
    };

    addSupplier(newSup);
    setAddOpen(false);
    setToastMessage(`Supplier partner "${newSup.name}" onboarded successfully.`);
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

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Procurement & Suppliers</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage raw ingredient growers, dairy cooperatives, and food packaging manufacturers.
          </p>
        </div>
        {hasPermission('suppliers', 'create') && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 cursor-pointer"
            style={{ background: '#2563eb' }}
          >
            <Plus size={15} /> Add Supplier Partner
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Suppliers" value={`${suppliers.length}`} accent="#2563eb" />
        <KPICard title="Active Partners" value={`${suppliers.filter(s => s.status === 'Active').length}`} accent="#16a34a" />
        <KPICard title="Total Sourcing Spend" value={formatCurrency(totalPurchase)} accent="#7c3aed" />
        <KPICard title="Avg Vendor Rating" value={avgRatingDisplay} accent="#f59e0b" />
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search suppliers or category..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
        />
      </div>

      {suppliers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <Truck size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Suppliers Registered</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Your company directory currently has no active suppliers. Add your first procurement partner below.
          </p>
          {hasPermission('suppliers', 'create') && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90"
              style={{ background: '#2563eb' }}
            >
              <Plus size={14} /> Onboard First Supplier
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {filtered.map(sup => (
            <div key={sup.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-base font-bold flex-shrink-0">
                    {sup.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 text-sm truncate">{sup.name}</div>
                    <div className="text-xs text-slate-400">{sup.category}</div>
                  </div>
                </div>
                <StatusBadge status={sup.status} />
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact Person:</span>
                  <span className="font-medium">{sup.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium text-blue-600">{sup.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-medium">{sup.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Terms:</span>
                  <span className="font-medium">{sup.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Procured:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(sup.totalPurchase)}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-medium">
                  <Star size={13} fill="currentColor" /> {sup.rating} / 5.0
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{sup.taxId}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Supplier */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Onboard Food & Beverage Supplier"
        subtitle="Add a raw ingredient vendor, dairy farm cooperative, or food packaging partner"
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
              onClick={handleAddSupplier}
              className="px-4 py-2 text-sm text-white rounded-xl font-medium shadow-sm hover:opacity-90 cursor-pointer"
              style={{ background: '#2563eb' }}
            >
              Save & Onboard Partner
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Supplier / Entity Name *</label>
            <input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Amul Dairy Cooperative (GCMMF)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Procurement Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="Dairy Ingredients">Dairy Ingredients</option>
              <option value="Coffee Plantations">Coffee Plantations</option>
              <option value="Cocoa & Confectionery">Cocoa & Confectionery</option>
              <option value="Packaging Solutions">Packaging Solutions</option>
              <option value="Grains & Flours">Grains & Flours</option>
              <option value="Flavours & Spices">Flavours & Spices</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Contact Person *</label>
            <input
              value={formData.contactPerson}
              onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="e.g. R.S. Sodhi"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="procurement@partner.com"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number</label>
            <input
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98200 12345"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Payment Terms</label>
            <select
              value={formData.paymentTerms}
              onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="Immediate / Advance">Immediate / Advance</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Factory / Plant Address</label>
            <input
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="Plant address, city, state and PIN..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">GSTIN / FSSAI License Number</label>
            <input
              value={formData.taxId}
              onChange={e => setFormData({ ...formData, taxId: e.target.value })}
              placeholder="e.g. 24AAACG1234F1Z8 / FSSAI #10012021000045"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
