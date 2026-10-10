import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AccessDenied from './AccessDenied';
import { payments, formatCurrency, getCustomerById } from '../data/mockData';

export default function Payments() {
  const { hasModule } = useApp();
  if (!hasModule('payments')) return <AccessDenied />;
  const totalReceived = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Payments</h1>
        <p className="text-slate-500 mt-1 text-sm">Track all incoming payments and receipts.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Payments" value={`${payments.length}`} accent="#2563eb" />
        <KPICard title="Completed" value={`${payments.filter(p => p.status === 'Completed').length}`} accent="#16a34a" />
        <KPICard title="Total Received" value={formatCurrency(totalReceived)} change="+18.4%" changeDir="up" accent="#7c3aed" />
        <KPICard title="Pending" value={`${payments.filter(p => p.status === 'Pending').length}`} accent="#f59e0b" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-100">{['Payment ID', 'Customer', 'Invoice', 'Amount', 'Method', 'Date', 'Reference', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map(p => {
                const customer = getCustomerById(p.customerId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{p.id}</td>
                    <td className="px-4 py-3 text-slate-700">{customer?.businessName}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{p.invoiceId}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{p.method}</span></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{p.date}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.reference}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} dot /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
