import { useState } from 'react';
import { Plus, Search, Download, Send, CheckCircle2, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type Invoice } from '../data/mockData';

export default function Invoices() {
  const { hasModule, hasPermission, invoices, customers, addInvoice, authMode } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for Create Invoice
  const getInitialFormData = () => authMode === 'real' ? {
    customerId: customers[0]?.id || '',
    amount: 0,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    terms: 'Net 30',
    notes: '',
    status: 'Sent' as Invoice['status'],
  } : {
    customerId: customers[0]?.id || 'c1',
    amount: 144000,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    terms: 'Net 30',
    notes: 'Bulk modern trade consignment: Nestlé Maggi & Nescafé beverage pallets.',
    status: 'Sent' as Invoice['status'],
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const handleOpenAdd = () => {
    setFormData(getInitialFormData());
    setAddOpen(true);
  };

  if (!hasModule('invoices')) return <AccessDenied />;

  const getCustomer = (id: string) => customers.find(c => c.id === id);

  const filtered = invoices.filter(inv => {
    const customer = getCustomer(inv.customerId);
    const matchSearch =
      !search ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      customer?.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paid = invoices.filter(i => i.status === 'Paid').length;
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
  const totalAmount = invoices.reduce((s, i) => s + i.amount, 0);

  const handleCreateInvoice = () => {
    const newInv: Invoice = {
      id: `INV-2026-${Date.now().toString().slice(-4)}`,
      orderId: 'SO-101',
      customerId: formData.customerId || (customers[0]?.id ?? 'c1'),
      amount: Number(formData.amount) || 0,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      status: formData.status,
      items: [
        {
          productId: 'p1',
          description: formData.notes,
          quantity: 1,
          unitPrice: Number(formData.amount) || 0,
          discount: 0,
          total: Number(formData.amount) || 0,
        },
      ],
    };

    addInvoice(newInv);
    setAddOpen(false);
    setToastMessage(`Tax Invoice ${newInv.id} generated and issued to customer.`);
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
          <h1 className="font-display text-2xl font-bold text-slate-900">Invoices & Billing</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Track B2B customer invoices, modern trade receivables, and payment settlement schedules.
          </p>
        </div>
        <div className="flex gap-2">
          {hasPermission('invoices', 'export') && (
            <button
              onClick={() => alert(`Exporting ${filtered.length} invoices to CSV...`)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Download size={14} /> Export
            </button>
          )}
          {hasPermission('invoices', 'create') && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 cursor-pointer"
              style={{ background: '#2563eb' }}
            >
              <Plus size={15} /> New Invoice
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Invoices" value={`${invoices.length}`} accent="#2563eb" />
        <KPICard title="Paid Invoices" value={`${paid}`} accent="#16a34a" />
        <KPICard title="Overdue Balance" value={formatCurrency(overdue)} change="Settlement alerts active" changeDir="down" accent="#dc2626" />
        <KPICard title="Total Billed" value={formatCurrency(totalAmount)} accent="#7c3aed" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search invoices by ID or customer..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none"
        >
          {['All', 'Draft', 'Sent', 'Paid', 'Partially Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {invoices.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Invoices on File</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Your registered company currently has no commercial invoices generated. Create an invoice to bill a customer.
            </p>
            {hasPermission('invoices', 'create') && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90"
                style={{ background: '#2563eb' }}
              >
                <Plus size={14} /> Generate First Invoice
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Invoice ID', 'Customer Entity', 'Billing Amount', 'Issue Date', 'Due Date', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(inv => {
                  const customer = getCustomer(inv.customerId);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-blue-600">{inv.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{customer?.businessName || 'B2B Client'}</div>
                        <div className="text-xs text-slate-400">{customer?.customerType || 'Commercial'}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(inv.amount)}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{inv.issueDate}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{inv.dueDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Invoice */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Generate Tax Invoice"
        subtitle="Issue commercial GST invoice for retail dispatch or distributor order"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddOpen(false)}
              className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateInvoice}
              className="px-4 py-2 text-sm text-white rounded-xl font-medium shadow-sm hover:opacity-90 cursor-pointer"
              style={{ background: '#2563eb' }}
            >
              Generate & Issue Invoice
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">B2B Customer Entity *</label>
            <select
              value={formData.customerId}
              onChange={e => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              {customers.length > 0 ? (
                customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.businessName} ({c.customerType})
                  </option>
                ))
              ) : authMode === 'real' ? (
                <option value="" disabled>No customers registered — Add a Customer first</option>
              ) : (
                <>
                  <option value="c1">Reliance Retail Hypermarket Network</option>
                  <option value="c2">Avenue Supermarts (DMart Retail)</option>
                  <option value="c3">Blinkit Commerce Hub</option>
                </>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Invoice Amount (₹) *</label>
              <input
                type="number"
                min={1}
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Payment Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Payment Terms</label>
              <select
                value={formData.terms}
                onChange={e => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Initial Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="Sent">Sent to Customer</option>
                <option value="Draft">Draft</option>
                <option value="Paid">Mark as Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Consignment Notes / PO Reference</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
              placeholder="e.g. Dispatched against PO-8921. Delivery Challan #DC-4890 attached."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
