import { useState } from 'react';
import { Plus, CreditCard, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type Payment } from '../data/mockData';

export default function Payments() {
  const { hasModule, hasPermission, payments, customers, invoices, addPayment, authMode } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for Record Payment
  const getInitialFormData = () => authMode === 'real' ? {
    customerId: customers[0]?.id || '',
    invoiceId: invoices[0]?.id || '',
    amount: 0,
    method: 'RTGS / NEFT Electronic Transfer',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Completed' as Payment['status'],
  } : {
    customerId: customers[0]?.id || 'c1',
    invoiceId: invoices[0]?.id || 'INV-2026-001',
    amount: 144000,
    method: 'RTGS / NEFT Electronic Transfer',
    reference: `UTR${Date.now().toString().slice(-8)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Completed' as Payment['status'],
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const handleOpenAdd = () => {
    setFormData(getInitialFormData());
    setAddOpen(true);
  };

  if (!hasModule('payments')) return <AccessDenied />;

  const getCustomer = (id: string) => customers.find(c => c.id === id);

  const totalReceived = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);

  const handleRecordPayment = () => {
    const newPayment: Payment = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      customerId: formData.customerId || (customers[0]?.id ?? 'c1'),
      invoiceId: formData.invoiceId,
      amount: Number(formData.amount) || 0,
      method: formData.method,
      date: formData.date,
      reference: formData.reference,
      status: formData.status,
    };

    addPayment(newPayment);
    setAddOpen(false);
    setToastMessage(`Payment receipt ${newPayment.id} recorded successfully.`);
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
          <h1 className="font-display text-2xl font-bold text-slate-900">Payments & Remittances</h1>
          <p className="text-slate-500 mt-1 text-sm">Track all incoming distributor payments and banking reconciliations.</p>
        </div>
        {hasPermission('payments', 'create') && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 cursor-pointer"
            style={{ background: '#2563eb' }}
          >
            <Plus size={15} /> Record Payment
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Receipts" value={`${payments.length}`} accent="#2563eb" />
        <KPICard title="Settled" value={`${payments.filter(p => p.status === 'Completed').length}`} accent="#16a34a" />
        <KPICard title="Total Realized" value={formatCurrency(totalReceived)} change="+18.4%" changeDir="up" accent="#7c3aed" />
        <KPICard title="Pending Clearing" value={`${payments.filter(p => p.status === 'Pending').length}`} accent="#f59e0b" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {payments.length === 0 ? (
          <div className="py-16 text-center">
            <CreditCard size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Payments Recorded</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Your registered workspace currently has no payment transactions recorded. Record an incoming customer payment below.
            </p>
            {hasPermission('payments', 'create') && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90"
                style={{ background: '#2563eb' }}
              >
                <Plus size={14} /> Record First Payment
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Payment ID', 'Customer Entity', 'Invoice Reference', 'Settlement Amount', 'Payment Channel', 'Date', 'Bank Reference / UTR', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map(p => {
                  const customer = getCustomer(p.customerId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-blue-600">{p.id}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{customer?.businessName || 'B2B Client'}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs font-mono">{p.invoiceId}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(p.amount)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                          {p.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{p.date}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.reference}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} dot /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Record Payment */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Record Payment Receipt"
        subtitle="Log an incoming RTGS, NEFT, corporate cheque, or digital payment"
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
              onClick={handleRecordPayment}
              className="px-4 py-2 text-sm text-white rounded-xl font-medium shadow-sm hover:opacity-90 cursor-pointer"
              style={{ background: '#2563eb' }}
            >
              Confirm & Save Payment
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
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Invoice ID Reference</label>
              <input
                value={formData.invoiceId}
                onChange={e => setFormData({ ...formData, invoiceId: e.target.value })}
                placeholder="e.g. INV-2026-001"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Amount Realized (₹) *</label>
              <input
                type="number"
                min={1}
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Payment Method Channel</label>
              <select
                value={formData.method}
                onChange={e => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="RTGS / NEFT Electronic Transfer">RTGS / NEFT Electronic Transfer</option>
                <option value="Corporate NetBanking">Corporate NetBanking</option>
                <option value="Direct UPI Merchant">Direct UPI Merchant</option>
                <option value="Cheque / Demand Draft">Cheque / Demand Draft</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Clearing Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="Completed">Completed / Cleared</option>
                <option value="Pending">Pending Clearing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Bank UTR / Reference No. *</label>
              <input
                value={formData.reference}
                onChange={e => setFormData({ ...formData, reference: e.target.value })}
                placeholder="e.g. UTR18239012"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Payment Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
