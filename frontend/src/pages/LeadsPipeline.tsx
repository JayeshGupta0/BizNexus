import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Plus, Target, Filter, Search, ChevronRight, TrendingUp, Users, Zap, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AIInsightCard from '../components/ui/AIInsightCard';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import {
  leads, leadTrend, leadsBySource, conversionFunnel,
  campaigns, socialPosts, formatCurrency,
} from '../data/mockData';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] as const;
type Stage = typeof STAGES[number];

const STAGE_COLORS: Record<Stage, string> = {
  New: '#3b82f6',
  Contacted: '#f59e0b',
  Qualified: '#8b5cf6',
  Proposal: '#06b6d4',
  Negotiation: '#f97316',
  Won: '#16a34a',
  Lost: '#ef4444',
};

const PIE_COLORS = ['#E1306C', '#1877F2', '#0A66C2', '#2563EB', '#16A34A', '#7C3AED', '#F59E0B', '#94A3B8'];

const INITIAL_FORM = {
  companyName: '', contactPerson: '', email: '', phone: '', location: '',
  leadType: 'Business', source: 'Website', stage: 'New', potentialValue: '',
  priority: 'Medium', notes: '',
};

export default function LeadsPipeline() {
  const { hasModule } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<Stage | 'All'>('All');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  if (!hasModule('leads')) return <AccessDenied />;

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.companyName.toLowerCase().includes(search.toLowerCase()) || l.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'All' || l.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const byStage = (s: Stage) => filtered.filter(l => l.stage === s);
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.stage === 'New').length;
  const qualifiedLeads = leads.filter(l => l.stage === 'Qualified').length;
  const pipelineValue = leads.filter(l => !['Won', 'Lost'].includes(l.stage)).reduce((s, l) => s + l.potentialValue, 0);
  const wonLeads = leads.filter(l => l.stage === 'Won').length;
  const conversionRate = Math.round((wonLeads / totalLeads) * 100);
  const socialLeads = leads.filter(l => ['Instagram', 'Facebook', 'LinkedIn'].includes(l.source)).length;

  const leadTypeData = [
    { name: 'Retailer', value: leads.filter(l => l.leadType === 'Retailer').length },
    { name: 'Wholesaler', value: leads.filter(l => l.leadType === 'Wholesaler').length },
    { name: 'Distributor', value: leads.filter(l => l.leadType === 'Distributor').length },
    { name: 'Business', value: leads.filter(l => l.leadType === 'Business').length },
    { name: 'Enterprise', value: leads.filter(l => l.leadType === 'Enterprise').length },
  ].filter(d => d.value > 0);

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
        <div className="font-semibold text-slate-600 mb-1">{label}</div>
        {payload.map((p: any) => <div key={p.name} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: p.color }} /><span className="text-slate-600">{p.name}: <strong>{p.value}</strong></span></div>)}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Leads & Pipeline</h1>
          <p className="text-slate-500 mt-1 text-sm">Track prospects, opportunities, and business acquisition performance.</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
          <Plus size={15} /> Add Lead
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <KPICard title="Total Leads" value={`${totalLeads}`} icon={<Target size={16} />} accent="#2563eb" />
        <KPICard title="New Leads" value={`${newLeads}`} change="+8 this week" changeDir="up" icon={<Plus size={16} />} accent="#f59e0b" />
        <KPICard title="Qualified" value={`${qualifiedLeads}`} icon={<TrendingUp size={16} />} accent="#7c3aed" />
        <KPICard title="Pipeline Value" value={formatCurrency(pipelineValue)} change="+12.6%" changeDir="up" icon={<TrendingUp size={16} />} accent="#16a34a" />
        <KPICard title="Conversion Rate" value={`${conversionRate}%`} change="+2.1%" changeDir="up" icon={<Zap size={16} />} accent="#06b6d4" />
        <KPICard title="Social Leads" value={`${socialLeads}`} change="3 platforms" icon={<Globe size={16} />} accent="#E1306C" />
        <KPICard title="Distributors" value={`${leads.filter(l => l.leadType === 'Distributor').length}`} icon={<Users size={16} />} accent="#8b5cf6" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lead Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-1">Lead Generation Trend</h3>
          <p className="text-xs text-slate-400 mb-4">New, qualified & converted leads over 6 months</p>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={leadTrend}>
              <defs>
                <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                <linearGradient id="qualGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1}/><stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="new" name="New" stroke="#2563eb" strokeWidth={2} fill="url(#newGrad)" />
              <Area type="monotone" dataKey="qualified" name="Qualified" stroke="#7c3aed" strokeWidth={2} fill="url(#qualGrad)" />
              <Area type="monotone" dataKey="converted" name="Converted" stroke="#16a34a" strokeWidth={2} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Types */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-1">Lead Type Distribution</h3>
          <p className="text-xs text-slate-400 mb-3">By business category</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={leadTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3}>
                {leadTypeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {leadTypeData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-medium text-slate-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel + Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-1">Conversion Funnel</h3>
          <p className="text-xs text-slate-400 mb-4">Lead progression through pipeline stages</p>
          <div className="space-y-2">
            {conversionFunnel.map(stage => (
              <div key={stage.stage} className="flex items-center gap-3">
                <div className="w-20 text-xs font-medium text-slate-600 text-right">{stage.stage}</div>
                <div className="flex-1 h-7 rounded-lg overflow-hidden bg-slate-100 relative">
                  <div
                    className="h-full rounded-lg transition-all flex items-center justify-end pr-3"
                    style={{ width: `${stage.pct}%`, background: '#2563eb', opacity: 0.6 + (stage.pct / 100) * 0.4 }}
                  >
                    <span className="text-white text-xs font-semibold">{stage.count}</span>
                  </div>
                </div>
                <div className="w-10 text-xs text-slate-400">{stage.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-1">Leads by Source</h3>
          <p className="text-xs text-slate-400 mb-4">Where leads are coming from</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={leadsBySource} layout="vertical" barSize={12}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="source" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip formatter={(v) => [v, 'Leads']} />
              <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]}>
                {leadsBySource.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Social Media Campaign Performance */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">Social Media Lead Performance</h3>
          <p className="text-xs text-slate-400 mt-0.5">Campaign reach → leads → conversions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {['Campaign', 'Reach', 'Engagement', 'Enquiries', 'Leads', 'Qualified', 'Converted', 'Potential Revenue'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {socialPosts.filter(p => p.status === 'Published').map(post => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{post.title}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${post.platform === 'Instagram' ? 'bg-pink-100 text-pink-700' : post.platform === 'LinkedIn' ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600'}`}>{post.platform}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{post.reach.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{post.likes.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{post.enquiries}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{post.leadsGenerated}</td>
                  <td className="px-4 py-3 text-slate-600">{post.qualifiedLeads}</td>
                  <td className="px-4 py-3 font-medium text-green-600">{post.conversions}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(post.revenueAttributed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-display font-bold text-slate-900">Lead Pipeline</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search leads..."
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value as any)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="All">All Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-3 pb-4" style={{ minWidth: `${STAGES.length * 210}px` }}>
            {STAGES.map(stage => {
              const stageLeads = byStage(stage);
              return (
                <div key={stage} className="flex-shrink-0 w-48">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: STAGE_COLORS[stage] }} />
                      <span className="text-xs font-semibold text-slate-600">{stage.toUpperCase()}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageLeads.map(lead => (
                      <button
                        key={lead.id}
                        onClick={() => navigate(`/crm/leads/${lead.id}`)}
                        className="w-full bg-white rounded-xl border border-slate-200 p-3 text-left hover:border-blue-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <span className="text-sm font-semibold text-slate-800 leading-tight">{lead.companyName}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${lead.priority === 'High' ? 'bg-red-100 text-red-600' : lead.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                            {lead.priority}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-slate-500">{lead.leadType}</div>
                          <div className="text-xs text-slate-400">{lead.contactPerson}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-semibold text-slate-700">{formatCurrency(lead.potentialValue)}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${lead.source === 'Instagram' ? 'bg-pink-100 text-pink-600' : lead.source === 'LinkedIn' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                              {lead.source}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{lead.assignedTo}</div>
                        </div>
                      </button>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                        <div className="text-xs text-slate-400">No leads</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AIInsightCard
        insight="Distributor leads have the highest average potential value (₹9.2L). LinkedIn campaigns are generating fewer leads but higher-value opportunities. ABC Wholesale and Nova Distributor should be prioritised for follow-up this week."
        compact
      />

      {/* Add Lead Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Lead" subtitle="Create a new business opportunity" size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{ background: '#2563eb' }}>Save Lead</button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Company Name', key: 'companyName', type: 'text', placeholder: 'e.g. Acme Retail' },
            { label: 'Contact Person', key: 'contactPerson', type: 'text', placeholder: 'Full name' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'contact@company.com' },
            { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
            { label: 'Location', key: 'location', type: 'text', placeholder: 'City, State' },
            { label: 'Potential Value (₹)', key: 'potentialValue', type: 'number', placeholder: '500000' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Lead Type</label>
            <select value={form.leadType} onChange={e => setForm(p => ({ ...p, leadType: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
              {['Retailer', 'Wholesaler', 'Distributor', 'Business', 'Enterprise', 'Social Lead', 'Referral'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Source</label>
            <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
              {['Instagram', 'Facebook', 'LinkedIn', 'Website', 'Sales Team', 'Referral', 'Events', 'Email', 'Other'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Notes</label>
            <textarea rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none" placeholder="Additional context..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
