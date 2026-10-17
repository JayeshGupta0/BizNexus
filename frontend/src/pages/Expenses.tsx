import { useState } from 'react';
import { Plus, Receipt } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type Expense } from '../data/mockData';

export default function Expenses() {
  const { hasModule, expenses, addExpense, currentUser, authMode } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Operations',
    department: 'Sales',
  });

  if (!hasModule('expenses')) return <AccessDenied />;

  const isRealClean = authMode === 'real' && expenses.length === 0;
  const total = expenses.filter(e => e.status === 'Approved').reduce((s, e) => s + e.amount, 0);
  const pending = expenses.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0);
  const byCat = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] ?? 0) + e.amount; return acc; }, {} as Record<string, number>);
  const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0] ?? (isRealClean ? '—' : 'Marketing');

  const handleSubmit = () => {
    if (!form.description || !form.amount) return;
    const newExp: Expense = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      description: form.description.trim(),
      amount: Number(form.amount) || 0,
      date: form.date,
      category: form.category,
      department: form.department,
      submittedBy: currentUser?.name || 'Administrator',
      status: 'Approved',
    };
    addExpense(newExp);
    setForm({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Operations',
      department: 'Sales',
    });
    setAddOpen(false);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-500 mt-1 text-sm">Track and manage business expenses by department.</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
          <Plus size={15} /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Approved" value={formatCurrency(total)} accent="#2563eb" />
        <KPICard title="Pending Approval" value={formatCurrency(pending)} accent="#f59e0b" />
        <KPICard title="Top Category" value={topCat} accent="#7c3aed" />
        <KPICard title="Total Logged" value={formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))} accent="#dc2626" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Expense ID', 'Description', 'Category', 'Amount', 'Date', 'Department', 'Submitted By', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <Receipt size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No expenses recorded</p>
                    <p className="text-xs text-slate-400 mt-1">Click "+ Add Expense" to log operational expenses.</p>
                  </td>
                </tr>
              ) : (
                expenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{e.id}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs"><div className="truncate">{e.description}</div></td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{e.category}</span></td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(e.amount)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{e.date}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{e.department}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{e.submittedBy}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} dot /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Expense" size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600">Cancel</button>
            <button onClick={handleSubmit} disabled={!form.description || !form.amount} className="px-4 py-2 text-sm text-white rounded-xl font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>Submit</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description *</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="e.g. Office supplies / Freight charges..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Amount (₹) *</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="5000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
                {['Operations', 'Marketing', 'Travel', 'Salaries', 'Procurement', 'Utilities', 'Logistics', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Department</label>
              <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Sales / Operations / Finance" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
