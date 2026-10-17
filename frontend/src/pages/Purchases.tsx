import { useState } from 'react';
import { Plus, Search, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type PurchaseOrder } from '../data/mockData';

export default function Purchases() {
  const { hasModule, hasPermission, purchaseOrders, suppliers, addPurchaseOrder, authMode } = useApp();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for Create PO
  const getInitialFormData = () => authMode === 'real' ? {
    supplierId: suppliers[0]?.id || '',
    itemName: '',
    quantity: 1,
    unitPrice: 0,
    expectedDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: '',
  } : {
    supplierId: suppliers[0]?.id || 's1',
    itemName: 'Grade-A Arabica Coffee Beans (Bulk 50kg Sacks)',
    quantity: 120,
    unitPrice: 450,
    expectedDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: 'Food safety grade inspection certificate required upon gate delivery at Bhiwandi plant.',
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const handleOpenAdd = () => {
    setFormData(getInitialFormData());
    setAddOpen(true);
  };

  if (!hasModule('purchases')) return <AccessDenied />;

  const getSupplier = (id: string) => suppliers.find(s => s.id === id);

  const filtered = purchaseOrders.filter(po => {
    const supplier = getSupplier(po.supplierId);
    return (
      !search ||
      po.id.toLowerCase().includes(search.toLowerCase()) ||
      supplier?.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalValue = purchaseOrders.reduce((s, po) => s + po.total, 0);
  const pending = purchaseOrders.filter(po => ['Draft', 'Sent'].includes(po.status)).length;
  const confirmed = purchaseOrders.filter(po => po.status === 'Confirmed').length;
  const received = purchaseOrders.filter(po => po.status === 'Received').length;

  const handleCreatePO = (status: PurchaseOrder['status'] = 'Confirmed') => {
    const calculatedTotal = formData.quantity * formData.unitPrice;
    const newPO: PurchaseOrder = {
      id: `PO-${Date.now().toString().slice(-4)}`,
      supplierId: formData.supplierId || suppliers[0]?.id || 's1',
      items: [
        {
          productId: 'rm-1',
          productName: formData.itemName,
          quantity: formData.quantity,
          unitCost: formData.unitPrice,
          total: calculatedTotal,
        },
      ],
      total: calculatedTotal,
      status,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: formData.expectedDate,
      notes: formData.notes,
    };

    addPurchaseOrder(newPO);
    setAddOpen(false);
    setToastMessage(`Purchase Order ${newPO.id} created and dispatched to supplier.`);
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
          <h1 className="font-display text-2xl font-bold text-slate-900">Purchases & Procurement</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage purchase requisitions, raw ingredient sourcing, and vendor delivery milestones.
          </p>
        </div>
        {hasPermission('purchases', 'create') && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 cursor-pointer"
            style={{ background: '#2563eb' }}
          >
            <Plus size={15} /> Create Purchase Order
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Purchase Orders" value={`${purchaseOrders.length}`} accent="#2563eb" />
        <KPICard title="Pending Delivery" value={`${pending}`} accent="#f59e0b" />
        <KPICard title="Confirmed POs" value={`${confirmed}`} accent="#7c3aed" />
        <KPICard title="Received Batches" value={`${received}`} accent="#16a34a" />
        <KPICard title="Procurement Value" value={formatCurrency(totalValue)} accent="#2563eb" />
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search POs or supplier..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {purchaseOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Purchase Orders Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Your registered workspace currently has no procurement requisitions. Create your first supplier PO below.
            </p>
            {hasPermission('purchases', 'create') && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90"
                style={{ background: '#2563eb' }}
              >
                <Plus size={14} /> Create First PO
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['PO Number', 'Supplier Partner', 'Ingredient / Item', 'Procurement Value', 'Order Date', 'Expected Gate Date', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(po => {
                  const supplier = getSupplier(po.supplierId);
                  const firstItem = po.items[0];
                  return (
                    <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-blue-600">{po.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{supplier?.name || 'Direct F&B Vendor'}</div>
                        <div className="text-xs text-slate-400">{supplier?.category || 'Ingredients'}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        {firstItem?.productName || `${po.items.length} line items`}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(po.total)}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{po.orderDate}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{po.expectedDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Purchase Order */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Create Purchase Order"
        subtitle="Order raw materials, packaging materials, or food ingredients from approved vendors"
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
              onClick={() => handleCreatePO('Draft')}
              className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Save Draft PO
            </button>
            <button
              onClick={() => handleCreatePO('Confirmed')}
              className="px-4 py-2 text-sm text-white rounded-xl font-medium shadow-sm hover:opacity-90 cursor-pointer"
              style={{ background: '#2563eb' }}
            >
              Confirm & Issue PO
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Supplier / Procurement Partner *</label>
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
                ) : authMode === 'real' ? (
                  <option value="" disabled>No suppliers registered — Add a Supplier first</option>
                ) : (
                  <>
                    <option value="s1">Amul Dairy Cooperative (GCMMF)</option>
                    <option value="s2">Tata Coffee Plantations Ltd.</option>
                    <option value="s3">Barry Callebaut Cocoa Processing</option>
                    <option value="s4">Tetra Pak India Packaging Systems</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Expected Gate Receiving Date</label>
              <input
                type="date"
                value={formData.expectedDate}
                onChange={e => setFormData({ ...formData, expectedDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Ingredient / Raw Material Item Description *</label>
            <input
              value={formData.itemName}
              onChange={e => setFormData({ ...formData, itemName: e.target.value })}
              placeholder="e.g. Grade-A Arabica Coffee Beans (Bulk 50kg Sacks)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Quantity (Units / Sacks / Litres)</label>
              <input
                type="number"
                min={1}
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Agreed Unit Rate (₹)</label>
              <input
                type="number"
                min={1}
                value={formData.unitPrice}
                onChange={e => setFormData({ ...formData, unitPrice: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">FSSAI / Quality Checklist & Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
              placeholder="Batch quality notes, COA requirement, temperature conditions..."
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center text-sm border border-slate-100">
            <span className="font-medium text-slate-600">Total Purchase Commitment:</span>
            <span className="font-bold text-slate-900 text-lg">
              {formatCurrency(formData.quantity * formData.unitPrice)}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
