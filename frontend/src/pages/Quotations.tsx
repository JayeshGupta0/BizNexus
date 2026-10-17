import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Send, Download, ShoppingCart, Eye, FileText, CheckCircle2, Clock, AlertCircle, Building2, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import {
  formatCurrency,
  getCustomerById as mockGetCustomerById,
  getLeadById as mockGetLeadById,
  getProductById as mockGetProductById,
  type Quotation,
  type OrderItem,
} from '../data/mockData';

export default function Quotations() {
  const { hasModule, hasPermission, quotations, addQuotation, customers, leads, products, authMode, currentUser, availableUsers } = useApp();
  const navigate = useNavigate();

  const [quotationList, setQuotationList] = useState<Quotation[]>(quotations);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setQuotationList(quotations);
  }, [quotations]);

  const getCustomer = (id?: string) => customers.find(c => c.id === id) || (authMode === 'demo' && id ? mockGetCustomerById(id) : undefined);
  const getLead = (id?: string) => leads.find(l => l.id === id) || (authMode === 'demo' && id ? mockGetLeadById(id) : undefined);
  const getProduct = (id?: string) => products.find(p => p.id === id) || (authMode === 'demo' && id ? mockGetProductById(id) : undefined);
  const getProductById = getProduct;
  const getCustomerById = getCustomer;
  const getLeadById = getLead;

  // Modals state
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New quote form state
  const [targetType, setTargetType] = useState<'customer' | 'lead'>('customer');
  const [targetId, setTargetId] = useState<string>(authMode === 'real' ? (customers[0]?.id || '') : 'c1');
  const [selectedProduct, setSelectedProduct] = useState<string>(authMode === 'real' ? (products[0]?.id || '') : 'p1');
  const [quantity, setQuantity] = useState<number>(authMode === 'real' ? 1 : 2);
  const [discount, setDiscount] = useState<number>(0);
  const [salesperson, setSalesperson] = useState<string>(authMode === 'real' ? (currentUser?.name || '') : 'Rahul Sharma');
  const [notes, setNotes] = useState<string>(authMode === 'real' ? '' : 'Commercial agreement for Q4 rollout.');

  const handleOpenCreateModal = () => {
    if (authMode === 'real') {
      setTargetType('customer');
      setTargetId(customers[0]?.id || leads[0]?.id || '');
      setSelectedProduct(products[0]?.id || '');
      setQuantity(1);
      setDiscount(0);
      setSalesperson(currentUser?.name || '');
      setNotes('');
    } else {
      setTargetType('customer');
      setTargetId(customers[0]?.id || 'c1');
      setSelectedProduct(products[0]?.id || 'p1');
      setQuantity(2);
      setDiscount(5);
      setSalesperson('Rahul Sharma');
      setNotes('Commercial agreement for Q4 rollout.');
    }
    setCreateModalOpen(true);
  };


  if (!hasModule('quotations')) return <AccessDenied />;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = quotationList.filter((q) => {
    const entity = q.customerId ? getCustomer(q.customerId) : null;
    const lead = q.leadId ? getLead(q.leadId) : null;
    const name = entity?.businessName ?? lead?.companyName ?? '';
    const matchSearch =
      !search ||
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      q.salesperson.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const accepted = quotationList.filter((q) => q.status === 'Accepted').length;
  const pending = quotationList.filter((q) => ['Draft', 'Sent', 'Viewed'].includes(q.status)).length;
  const expired = quotationList.filter((q) => ['Expired', 'Rejected'].includes(q.status)).length;
  const totalValue = quotationList.reduce((s, q) => s + q.total, 0);

  const handleSendQuote = (quoteId: string) => {
    setQuotationList((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'Sent' as const } : q))
    );
    if (selectedQuote?.id === quoteId) {
      setSelectedQuote((prev) => (prev ? { ...prev, status: 'Sent' } : null));
    }
    showToast(`Quotation ${quoteId} sent to client email successfully.`);
  };

  const handleAcceptQuote = (quoteId: string) => {
    setQuotationList((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'Accepted' as const } : q))
    );
    if (selectedQuote?.id === quoteId) {
      setSelectedQuote((prev) => (prev ? { ...prev, status: 'Accepted' } : null));
    }
    showToast(`Quotation ${quoteId} accepted by client.`);
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) {
      showToast('Please select a valid customer account or sales lead.');
      return;
    }
    const prod = getProduct(selectedProduct) || (products.length > 0 ? products[0] : undefined);
    if (!prod && products.length === 0) {
      showToast('Please add at least one product to your inventory before creating quotes.');
      return;
    }
    const unitPrice = prod?.price || 0;
    const itemSubtotal = unitPrice * quantity;
    const discountedTotal = Math.round(itemSubtotal * (1 - discount / 100));

    const newId = `QT-${1086 + quotationList.length}`;
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newQuote: Quotation = {
      id: newId,
      customerId: targetType === 'customer' ? targetId : undefined,
      leadId: targetType === 'lead' ? targetId : undefined,
      items: [
        {
          productId: selectedProduct,
          quantity,
          unitPrice,
          discount,
        },
      ],
      total: discountedTotal,
      createdDate: today,
      expiryDate: expiry,
      salesperson,
      status: 'Draft',
      notes,
    };

    addQuotation(newQuote);
    setQuotationList([newQuote, ...quotationList]);
    setCreateModalOpen(false);
    showToast(`Quotation ${newId} created successfully as Draft.`);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-2xl animate-fade-in border border-emerald-700">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">Commercial Quotations</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
              {quotationList.length} Active
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            Generate, review, and track client proposals, contract discounts, and binding sales commitments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasPermission('quotations', 'export') && (
            <button
              onClick={() => showToast('Exporting quotation ledger to CSV...')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 bg-white cursor-pointer font-medium"
            >
              <Download size={14} /> Export
            </button>
          )}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
            style={{ background: '#2563eb' }}
          >
            <Plus size={15} /> Create Quotation
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Quotations" value={`${quotationList.length}`} accent="#2563eb" />
        <KPICard title="Pending Client Decision" value={`${pending}`} accent="#f59e0b" />
        <KPICard title="Accepted & Signed" value={`${accepted}`} accent="#16a34a" />
        <KPICard title="Total Pipeline Value" value={formatCurrency(totalValue)} accent="#7c3aed" />
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by quote ID, customer name, salesperson..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none cursor-pointer"
        >
          {['All', 'Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Quotation ID', 'Client / Target Account', 'Total Value', 'Created Date', 'Valid Until', 'Salesperson', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-40" />
                    No quotations matching your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const entity = q.customerId ? getCustomer(q.customerId) : null;
                  const lead = q.leadId ? getLead(q.leadId) : null;
                  const entityName = entity?.businessName ?? lead?.companyName ?? 'Unknown Account';
                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-blue-600 font-mono">
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="hover:underline cursor-pointer"
                        >
                          {q.id}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{entityName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          {entity ? <Building2 size={11} /> : <User size={11} />}
                          {entity ? 'Existing Customer' : 'Sales Lead'}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatCurrency(q.total)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{q.createdDate}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{q.expiryDate}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs font-medium">{q.salesperson}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={q.status} dot />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedQuote(q)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                            title="View Quotation Breakdown"
                          >
                            <Eye size={14} />
                          </button>
                          {q.status === 'Draft' && (
                            <button
                              onClick={() => handleSendQuote(q.id)}
                              className="p-1.5 rounded hover:bg-blue-50 text-blue-600 cursor-pointer"
                              title="Send Quotation to Client"
                            >
                              <Send size={14} />
                            </button>
                          )}
                          {q.status === 'Sent' && (
                            <button
                              onClick={() => handleAcceptQuote(q.id)}
                              className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600 cursor-pointer"
                              title="Mark as Accepted"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => showToast(`Generating PDF receipt for ${q.id}...`)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
                            title="Download PDF"
                          >
                            <Download size={14} />
                          </button>
                          {q.status === 'Accepted' && (
                            <button
                              onClick={() => navigate('/sales/orders')}
                              className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100 cursor-pointer transition-colors"
                              title="Convert to Sales Order"
                            >
                              <ShoppingCart size={11} /> Convert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Quotation Detail Modal ── */}
      {selectedQuote && (
        <Modal
          open={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`Quotation Details: ${selectedQuote.id}`}
          subtitle={`Issued on ${selectedQuote.createdDate} · Valid until ${selectedQuote.expiryDate}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="text-xs text-slate-500">
                Status: <span className="font-semibold text-slate-700">{selectedQuote.status}</span>
              </div>
              <div className="flex gap-2">
                {selectedQuote.status === 'Draft' && (
                  <button
                    onClick={() => handleSendQuote(selectedQuote.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Send size={13} /> Send to Client
                  </button>
                )}
                {selectedQuote.status === 'Accepted' && (
                  <button
                    onClick={() => navigate('/sales/orders')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <ShoppingCart size={13} /> Convert to Sales Order
                  </button>
                )}
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          }
        >
          {(() => {
            const entity = selectedQuote.customerId ? getCustomer(selectedQuote.customerId) : null;
            const lead = selectedQuote.leadId ? getLead(selectedQuote.leadId) : null;
            const clientName = entity?.businessName ?? lead?.companyName ?? 'Account';
            const contactName = entity?.contactPerson ?? lead?.contactPerson ?? 'Authorized Representative';
            const email = entity?.email ?? lead?.email ?? 'contact@client.com';
            const phone = entity?.phone ?? lead?.phone ?? '+91 98000 00000';

            return (
              <div className="space-y-5 text-sm">
                {/* Client info banner */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Billed To</div>
                    <div className="font-bold text-slate-900 text-base mt-0.5">{clientName}</div>
                    <div className="text-xs text-slate-600 mt-1">{contactName}</div>
                    <div className="text-xs text-slate-500">{email} · {phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Commercial Executive</div>
                    <div className="font-bold text-slate-800 mt-0.5">{selectedQuote.salesperson}</div>
                    <div className="text-xs text-slate-500 mt-1">Status: <StatusBadge status={selectedQuote.status} dot /></div>
                    <div className="text-xs text-slate-500 mt-1">Payment Terms: 30 Days Net</div>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <h3 className="font-semibold text-xs text-slate-700 uppercase tracking-wider mb-2">Quotation Line Items</h3>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <th className="px-3 py-2 text-left">Product / SKU</th>
                        <th className="px-3 py-2 text-center">Qty</th>
                        <th className="px-3 py-2 text-right">Unit Price</th>
                        <th className="px-3 py-2 text-right">Discount</th>
                        <th className="px-3 py-2 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedQuote.items.map((it, idx) => {
                        const prod = getProduct(it.productId);
                        const lineTotal = Math.round(it.quantity * it.unitPrice * (1 - it.discount / 100));
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-2.5">
                              <div className="font-semibold text-slate-800">{prod?.name || it.productId}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{prod?.sku || 'SKU-STD'}</div>
                            </td>
                            <td className="px-3 py-2.5 text-center font-medium">{it.quantity}</td>
                            <td className="px-3 py-2.5 text-right text-slate-600">{formatCurrency(it.unitPrice)}</td>
                            <td className="px-3 py-2.5 text-right text-amber-600 font-medium">{it.discount}%</td>
                            <td className="px-3 py-2.5 text-right font-bold text-slate-900">{formatCurrency(lineTotal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Total calculation breakdown */}
                <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Net Subtotal:</span>
                    <span className="font-medium">{formatCurrency(selectedQuote.total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable GST (18% inclusive):</span>
                    <span className="font-medium">{formatCurrency(Math.round(selectedQuote.total * 0.18))}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between text-sm font-bold text-slate-900">
                    <span>Authorized Total:</span>
                    <span className="text-blue-600">{formatCurrency(selectedQuote.total)}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedQuote.notes && (
                  <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold">Terms & Special Notes: </span>
                    {selectedQuote.notes}
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* ── Create Quotation Modal ── */}
      {createModalOpen && (
        <Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create Commercial Quotation"
          subtitle="Generate an authoritative quote for a lead or existing customer"
          size="md"
        >
          <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Account Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="radio"
                    name="targetType"
                    checked={targetType === 'customer'}
                    onChange={() => {
                      setTargetType('customer');
                      setTargetId(customers[0]?.id || 'c1');
                    }}
                  />
                  Existing Customer
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="radio"
                    name="targetType"
                    checked={targetType === 'lead'}
                    onChange={() => {
                      setTargetType('lead');
                      setTargetId(leads[0]?.id || 'l1');
                    }}
                  />
                  Sales Lead / Prospect
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Account / Prospect</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-medium"
              >
                {targetType === 'customer'
                  ? customers.length > 0
                    ? customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.businessName} ({c.contactPerson})
                        </option>
                      ))
                    : <option value="">No registered customers (add customers first)</option>
                  : leads.length > 0
                    ? leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.companyName} ({l.contactPerson})
                        </option>
                      ))
                    : <option value="">No leads recorded (add leads first)</option>}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Primary Product / Package</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500 font-medium"
              >
                {products.length > 0 ? (
                  products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatCurrency(p.price)}
                    </option>
                  ))
                ) : (
                  <option value="">No products in catalog</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Sales Executive</label>
              {authMode === 'real' ? (
                availableUsers && availableUsers.length > 0 ? (
                  <select
                    value={salesperson}
                    onChange={(e) => setSalesperson(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none font-medium"
                  >
                    {availableUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={salesperson}
                    onChange={(e) => setSalesperson(e.target.value)}
                    placeholder="e.g. Sales representative name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none font-medium"
                  />
                )
              ) : (
                <select
                  value={salesperson}
                  onChange={(e) => setSalesperson(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none font-medium"
                >
                  <option>Rahul Sharma</option>
                  <option>Priya Shah</option>
                  <option>Vikramaditya Singhania</option>
                </select>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Commercial Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special warranty terms, payment schedule, or delivery conditions..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none resize-none"
              />
            </div>

            {/* Estimated Total */}
            {(() => {
              const p = getProduct(selectedProduct) || products[0];
              const estTotal = p ? Math.round(p.price * quantity * (1 - discount / 100)) : 0;
              return (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center text-xs">
                  <span className="font-semibold text-blue-900">Estimated Total (Incl. Discount):</span>
                  <span className="font-extrabold text-blue-700 text-sm">{formatCurrency(estTotal)}</span>
                </div>
              );
            })()}

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Create Quotation
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
