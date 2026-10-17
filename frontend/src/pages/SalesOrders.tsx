import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, ShoppingCart, Download, CheckCircle2, PackageCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type SalesOrder } from '../data/mockData';

export default function SalesOrders() {
  const { hasModule, hasPermission, salesOrders, customers, products, addSalesOrder, authMode, currentUser, availableUsers } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);

  // Form State for Create Order
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [salesperson, setSalesperson] = useState(authMode === 'real' ? (currentUser?.name || '') : 'Rahul Sharma');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(authMode === 'real' ? 1 : 50);
  const [discountPercent, setDiscountPercent] = useState(authMode === 'real' ? 0 : 5);
  const [billingAddress, setBillingAddress] = useState(authMode === 'real' ? '' : 'Reliance Retail DC, Bhiwandi Logistics Park, Mumbai 421302');
  const [shippingAddress, setShippingAddress] = useState(authMode === 'real' ? '' : 'Reliance Retail Hypermarket Depot #14, Navi Mumbai 400705');
  const [orderCreatedToast, setOrderCreatedToast] = useState(false);

  if (!hasModule('sales-orders')) return <AccessDenied />;

  const getCustomer = (id: string) => customers.find(c => c.id === id);
  const getProduct = (id: string) => products.find(p => p.id === id);

  const filtered = salesOrders.filter(o => {
    const customer = getCustomer(o.customerId);
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      customer?.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.fulfillmentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = salesOrders.reduce((s, o) => s + o.total, 0);
  const pending = salesOrders.filter(o => o.fulfillmentStatus === 'Confirmed' || o.fulfillmentStatus === 'Processing').length;
  const completed = salesOrders.filter(o => o.fulfillmentStatus === 'Delivered').length;

  // Active product in modal
  const activeProduct = getProduct(selectedProductId) || products[0];
  const unitPrice = activeProduct ? activeProduct.price : 1800;
  const subtotal = unitPrice * qty;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const gstAmount = Math.round((subtotal - discountAmount) * 0.18);
  const grandTotal = subtotal - discountAmount + gstAmount;

  const handleOpenModal = () => {
    if (authMode === 'real') {
      setSelectedCustomerId(customers.length > 0 ? customers[0].id : '');
      setSelectedProductId(products.length > 0 ? products[0].id : '');
      setSalesperson(currentUser?.name || '');
      setQty(1);
      setDiscountPercent(0);
      setBillingAddress('');
      setShippingAddress('');
    } else {
      if (customers.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(customers[0].id);
      }
      if (products.length > 0 && !selectedProductId) {
        setSelectedProductId(products[0].id);
      }
      setSalesperson('Rahul Sharma');
      setQty(50);
      setDiscountPercent(5);
      setBillingAddress('Reliance Retail DC, Bhiwandi Logistics Park, Mumbai 421302');
      setShippingAddress('Reliance Retail Hypermarket Depot #14, Navi Mumbai 400705');
    }
    setAddOpen(true);
  };

  const handleCreateOrder = (fulfillmentStatus: SalesOrder['fulfillmentStatus']) => {
    const custId = selectedCustomerId || (customers[0]?.id ?? 'cust-demo-1');
    const prodId = selectedProductId || (products[0]?.id ?? 'p1');
    const productObj = getProduct(prodId);

    const newOrder: SalesOrder = {
      id: `SO-${Date.now().toString().slice(-4)}`,
      customerId: custId,
      items: [
        {
          productId: prodId,
          productName: productObj?.name || 'Maggi 2-Minute Masala Noodles (Pack of 24)',
          quantity: qty,
          unitPrice: unitPrice,
          discount: discountPercent,
          total: grandTotal,
        },
      ],
      subtotal,
      tax: gstAmount,
      discount: discountAmount,
      total: grandTotal,
      paymentStatus: fulfillmentStatus === 'Draft' ? 'Pending' : 'Partial',
      fulfillmentStatus,
      orderDate: new Date().toISOString().split('T')[0],
      salesperson,
      shippingAddress,
      billingAddress,
      notes: 'FMCG modern trade wholesale dispatch',
    };

    addSalesOrder(newOrder);
    setAddOpen(false);
    setOrderCreatedToast(true);
    setTimeout(() => setOrderCreatedToast(false), 3000);
  };

  return (
    <div className="p-6 space-y-5">
      {orderCreatedToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-md animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>New sales order was successfully provisioned and queued for warehouse dispatch!</span>
        </div>
      )}

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Sales Orders</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage wholesale orders, modern trade allocations, and distributor dispatches.</p>
        </div>
        <div className="flex gap-2">
          {hasPermission('sales-orders', 'export') && (
            <button
              onClick={() => alert(`Exporting ${filtered.length} sales orders to CSV...`)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Download size={14} /> Export
            </button>
          )}
          {hasPermission('sales-orders', 'create') && (
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 cursor-pointer"
              style={{ background: '#2563eb' }}
            >
              <Plus size={15} /> Create Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Total Orders" value={`${salesOrders.length}`} accent="#2563eb" />
        <KPICard title="Pending Dispatch" value={`${pending}`} accent="#f59e0b" />
        <KPICard title="Processing" value={`${salesOrders.filter(o => o.fulfillmentStatus === 'Processing').length}`} accent="#7c3aed" />
        <KPICard title="Delivered" value={`${completed}`} accent="#16a34a" />
        <KPICard title="Total Value" value={formatCurrency(totalValue)} change="+18.4%" changeDir="up" accent="#2563eb" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders by ID or customer..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none"
        >
          {['All', 'Draft', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {salesOrders.length === 0 ? (
          <div className="py-16 text-center">
            <PackageCheck size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Sales Orders Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Your registered corporate workspace currently has no sales orders. Click below to book your first client consignment.
            </p>
            {hasPermission('sales-orders', 'create') && (
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90"
                style={{ background: '#2563eb' }}
              >
                <Plus size={14} /> Create First Order
              </button>
            )}
          </div>
        ) : (
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
                  const customer = getCustomer(order.customerId);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 font-medium text-blue-600">{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{customer?.businessName || 'Direct B2B Account'}</div>
                        <div className="text-xs text-slate-400">{customer?.customerType || 'Wholesale Partner'}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{order.items.length} SKUs</td>
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
        )}
      </div>

      {/* Modal: Create Sales Order */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Create Food & Beverage Sales Order"
        subtitle="Book a wholesale consignment for modern trade / retail distribution"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button onClick={() => handleCreateOrder('Draft')} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer">
              Save as Draft
            </button>
            <button onClick={() => handleCreateOrder('Confirmed')} className="px-4 py-2 text-sm text-white rounded-xl font-medium shadow-sm hover:opacity-90 cursor-pointer" style={{ background: '#2563eb' }}>
              Confirm Order
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">B2B Customer *</label>
              <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
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
                    <option value="c3">Blinkit Commerce / Eternal FMCG</option>
                    <option value="c4">Metro Cash & Carry Wholesale</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Enterprise Sales Account Owner</label>
              {authMode === 'real' ? (
                availableUsers && availableUsers.length > 0 ? (
                  <select
                    value={salesperson}
                    onChange={e => setSalesperson(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {availableUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={salesperson}
                    onChange={e => setSalesperson(e.target.value)}
                    placeholder="e.g. Sales representative name"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                )
              ) : (
                <select
                  value={salesperson}
                  onChange={e => setSalesperson(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {['Rahul Sharma', 'Priya Shah', 'Vikramaditya Singh'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Food & Beverage Product Line Item</label>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Product / SKU</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Unit Wholesale Price</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Qty (Cartons/Packs)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Distributor Disc %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      <select
                        value={selectedProductId}
                        onChange={e => setSelectedProductId(e.target.value)}
                        className="text-sm border border-slate-200 rounded px-2 py-1 bg-white w-full max-w-xs truncate"
                      >
                        {products.length > 0 ? (
                          products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku})
                            </option>
                          ))
                        ) : authMode === 'real' ? (
                          <option value="" disabled>No products in catalog — Add a Product first</option>
                        ) : (
                          <>
                            <option value="p1">Maggi 2-Minute Masala Noodles (Pack of 24)</option>
                            <option value="p2">Nescafé Classic Instant Coffee (500g Jar)</option>
                            <option value="p3">KitKat 4-Finger Crisp Wafer Bar (Box of 30)</option>
                            <option value="p4">Nestlé Milkmaid Condensed Milk (400g Tin)</option>
                            <option value="p5">Nestlé Cerelac Wheat-Apple (300g)</option>
                            <option value="p6">Nestlé Everyday Dairy Whitener (1kg Pouch)</option>
                            <option value="p7">Nestea Premium Lemon Iced Tea (1kg Pack)</option>
                          </>
                        )}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        min={0}
                        value={unitPrice}
                        onChange={e => {
                          /* For real mode, allow manual price entry */
                        }}
                        readOnly={products.length > 0}
                        className="w-24 text-right border border-slate-200 rounded px-2 py-1 text-xs font-medium"
                        title={products.length > 0 ? 'Price derived from product catalog' : 'Enter unit price'}
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-right border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={discountPercent}
                        onChange={e => setDiscountPercent(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 text-right border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Billing Address</label>
              <textarea
                rows={2}
                value={billingAddress}
                onChange={e => setBillingAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                placeholder="Billing address..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Shipping Distribution Center</label>
              <textarea
                rows={2}
                value={shippingAddress}
                onChange={e => setShippingAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                placeholder="Shipping address..."
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-end gap-1 text-sm border border-slate-100">
            <div className="flex justify-between w-60">
              <span className="text-slate-500">Gross Subtotal:</span>
              <span className="font-medium text-slate-700">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between w-60">
              <span className="text-slate-500">Distributor Margin ({discountPercent}%):</span>
              <span className="font-medium text-red-600">-{formatCurrency(discountAmount)}</span>
            </div>
            <div className="flex justify-between w-60">
              <span className="text-slate-500">GST (18% FMCG standard):</span>
              <span className="font-medium text-slate-700">{formatCurrency(gstAmount)}</span>
            </div>
            <div className="flex justify-between w-60 border-t border-slate-200 pt-1.5 mt-1">
              <span className="font-semibold text-slate-800">Grand Total:</span>
              <span className="font-bold text-slate-900 text-base">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
