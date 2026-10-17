import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { ArrowLeft, Edit, Plus, FileText, ShoppingCart, Sparkles, Phone, Mail, Globe, MapPin, Building2, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AIInsightCard from '../components/ui/AIInsightCard';
import { formatCurrency, customers as demoCustomers } from '../data/mockData';

const TABS = ['Overview', 'Orders', 'Invoices', 'Activities', 'Notes'] as const;
type Tab = typeof TABS[number];

const AI_INSIGHTS: Record<string, string> = {
  c1: 'Customer health is excellent. Purchase frequency increased 14% over the last quarter. Acme Corporation is the top revenue contributor — consider an annual contract renewal discussion.',
  c2: 'NovaTech Industries is exploring AI capabilities. Follow-up recommended on the AI Assistant Pro upsell opportunity — potential ₹1.2L additional revenue.',
  c3: 'Orbit Technologies recently accepted QT-1080. This is a growing account with high upsell potential.',
  c4: 'Apex Retail is your second-largest retail customer. High order frequency, consistent payment behaviour.',
  c5: 'Vertex Solutions has ₹2.2L outstanding (overdue). Urgent follow-up required to prevent further ageing.',
  c6: 'CloudPeak Labs has the best payment track record. Excellent candidate for reference marketing and case study.',
  c7: 'Greenfield Co. is at risk. Irregular purchase pattern and ₹95K overdue. Schedule immediate account review.',
};

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasModule, customers, salesOrders, invoices, authMode } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  if (!hasModule('customers')) return <div className="p-6 text-center text-slate-500">Access denied</div>;

  const customer = customers.find(c => c.id === id) || (authMode === 'demo' ? demoCustomers.find(c => c.id === id) : undefined);
  if (!customer) return (
    <div className="p-6 text-center">
      <p className="text-slate-500">Customer not found.</p>
      <button onClick={() => navigate('/crm/customers')} className="mt-3 text-blue-600 text-sm font-medium hover:underline">← Back to Customers</button>
    </div>
  );

  const customerOrders = salesOrders.filter(o => o.customerId === customer.id);
  const customerInvoices = invoices.filter(i => i.customerId === customer.id);

  return (
    <div className="p-6 space-y-5">
      <button onClick={() => navigate('/crm/customers')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={16} /> Back to Customers
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold flex-shrink-0">
              {customer.businessName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-xl font-bold text-slate-900">{customer.businessName}</h1>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{customer.customerType}</span>
                <StatusBadge status={customer.status} dot />
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Building2 size={13} /> {customer.industry}</span>
                <span className="flex items-center gap-1.5"><MapPin size={13} /> {customer.location}</span>
                <span className="flex items-center gap-1.5"><Mail size={13} /> {customer.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={13} /> {customer.phone}</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">Customer since {customer.customerSince} · Account owner: {customer.accountOwner}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasPermission('customers', 'edit') && (
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><Edit size={14} /> Edit</button>
            )}
            {hasPermission('sales-orders', 'create') && (
              <button onClick={() => navigate('/sales/orders')} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><ShoppingCart size={14} /> Create Order</button>
            )}
            <button onClick={() => navigate('/ai-assistant')} className="flex items-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg font-medium" style={{ background: '#7c3aed' }}>
              <Sparkles size={14} /> Ask AI
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <KPICard title="Total Orders" value={`${customer.totalOrders}`} accent="#2563eb" />
          <KPICard title="Total Revenue" value={formatCurrency(customer.totalRevenue)} change="+14%" changeDir="up" accent="#16a34a" />
          <KPICard title="Avg Order Value" value={formatCurrency(customer.avgOrderValue)} accent="#7c3aed" />
          <KPICard title="Outstanding" value={customer.outstanding > 0 ? formatCurrency(customer.outstanding) : '₹0'} changeDir={customer.outstanding > 0 ? 'down' : 'neutral'} accent={customer.outstanding > 0 ? '#dc2626' : '#16a34a'} />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Contact Person', value: customer.contactPerson },
                  { label: 'Email', value: customer.email },
                  { label: 'Phone', value: customer.phone },
                  { label: 'Location', value: customer.location },
                  { label: 'Website', value: customer.website },
                  { label: 'Tax ID / GSTIN', value: customer.taxId },
                  { label: 'Address', value: customer.address },
                  { label: 'Account Owner', value: customer.accountOwner },
                ].map(f => (
                  <div key={f.label} className={f.label === 'Address' ? 'col-span-2' : ''}>
                    <div className="text-xs font-medium text-slate-400 mb-0.5">{f.label}</div>
                    <div className="text-sm text-slate-800">{f.value || '—'}</div>
                  </div>
                ))}
              </div>
            </div>

            <AIInsightCard
              title="AI Customer Insight"
              insight={AI_INSIGHTS[customer.id] ?? 'Analysing customer data and purchase patterns...'}
              onAskAI={() => navigate('/ai-assistant')}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-3">Customer Health</h3>
              <div className="space-y-3">
                {[
                  { label: 'Payment Health', value: customer.outstanding === 0 ? 95 : customer.outstanding < 100000 ? 65 : 30, color: '#16a34a' },
                  { label: 'Purchase Frequency', value: customer.totalOrders > 30 ? 90 : customer.totalOrders > 15 ? 65 : 40, color: '#2563eb' },
                  { label: 'Revenue Growth', value: customer.status === 'Active' ? 78 : 35, color: '#7c3aed' },
                  { label: 'Engagement Score', value: customer.status === 'Active' ? 85 : customer.status === 'At Risk' ? 25 : 50, color: '#f59e0b' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">{m.label}</span>
                      <span className="font-medium text-slate-700">{m.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div className="h-full rounded-full transition-all" style={{ width: `${m.value}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button onClick={() => navigate('/sales/orders')} className="w-full flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 text-left"><ShoppingCart size={14} className="text-blue-500" /> New Order</button>
                <button onClick={() => navigate('/sales/quotations')} className="w-full flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 text-left"><FileText size={14} className="text-blue-500" /> Create Quotation</button>
                <button className="w-full flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 text-left"><Mail size={14} className="text-blue-500" /> Send Email</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Orders' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>{['Order ID', 'Date', 'Items', 'Amount', 'Payment', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {customerOrders.length ? customerOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{order.id}</td>
                    <td className="px-4 py-3 text-slate-500">{order.orderDate}</td>
                    <td className="px-4 py-3 text-slate-600">{order.items.length} items</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td>
                    <td className="px-4 py-3"><StatusBadge status={order.fulfillmentStatus} /></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Invoices' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>{['Invoice ID', 'Amount', 'Issue Date', 'Due Date', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {customerInvoices.length ? customerInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{inv.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3 text-slate-500">{inv.issueDate}</td>
                    <td className="px-4 py-3 text-slate-500">{inv.dueDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} dot /></td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No invoices found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'Activities' || activeTab === 'Notes') && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-400 text-sm">{activeTab === 'Activities' ? 'Activity timeline will appear here.' : 'Notes for this account will appear here.'}</p>
          <button className="mt-3 flex items-center gap-1.5 text-sm text-blue-600 font-medium mx-auto hover:underline">
            <Plus size={13} /> Add {activeTab === 'Activities' ? 'Activity' : 'Note'}
          </button>
        </div>
      )}
    </div>
  );
}
