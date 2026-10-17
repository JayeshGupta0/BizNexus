import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  ArrowLeft, Edit, UserCheck, FileText, Plus, MoreHorizontal,
  Phone, Mail, MapPin, Calendar, User, Target, Clock, ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/ui/StatusBadge';
import AIInsightCard from '../components/ui/AIInsightCard';
import Modal from '../components/ui/Modal';
import { getLeadById, formatCurrency } from '../data/mockData';

const ACTIVITY_ICONS: Record<string, string> = {
  call: '📞', email: '✉️', meeting: '🤝', note: '📝', quote: '📄', system: '⚡',
};

const AI_INSIGHTS: Record<string, string> = {
  l1: 'High-potential retail opportunity. Prospect has viewed the quotation and requested revised pricing — strong buying signal. Recommended next action: follow up personally with revised pricing within 24 hours.',
  l2: 'Wholesale opportunity generated from Instagram campaign. Currently in qualification stage. Budget confirmed. Competitor evaluation underway — schedule a demo to differentiate BizNexuz capabilities.',
  l3: 'High-value distributor opportunity. Engagement is increasing and the prospect has requested pricing twice. Recommended next action: schedule a sales meeting to finalise terms and close the deal.',
  l4: 'Early-stage referral lead. Warm introduction from Acme Corporation. Send personalised introduction and product overview. Follow-up within 3 days recommended.',
  l5: 'New social media lead. Needs prompt initial contact to maintain engagement. Assign discovery call within 48 hours.',
  l6: 'Successfully converted to customer. Revenue attributed to Events channel.',
  l7: 'Lost to competitor on pricing. Consider price-match strategy for future distributor outreach.',
};

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasModule, hasPermission, leads, authMode } = useApp();
  const [convertOpen, setConvertOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  if (!hasModule('leads')) return (
    <div className="p-6 text-center text-slate-500">Access denied</div>
  );

  const lead = leads.find(l => l.id === id) || (authMode === 'demo' ? getLeadById(id ?? '') : undefined);
  if (!lead) return (
    <div className="p-6 text-center">
      <p className="text-slate-500">Lead not found.</p>
      <button onClick={() => navigate('/crm/leads')} className="mt-3 text-blue-600 text-sm font-medium hover:underline">← Back to Leads</button>
    </div>
  );

  const stageColor: Record<string, string> = {
    New: 'bg-blue-100 text-blue-700',
    Contacted: 'bg-amber-100 text-amber-700',
    Qualified: 'bg-purple-100 text-purple-700',
    Proposal: 'bg-cyan-100 text-cyan-700',
    Negotiation: 'bg-orange-100 text-orange-700',
    Won: 'bg-green-100 text-green-700',
    Lost: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 space-y-5">
      {/* Back */}
      <button onClick={() => navigate('/crm/leads')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft size={16} /> Back to Leads
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 text-xl font-bold flex-shrink-0">
              {lead.companyName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-xl font-bold text-slate-900">{lead.companyName}</h1>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stageColor[lead.stage] ?? 'bg-slate-100 text-slate-600'}`}>{lead.stage}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${lead.priority === 'High' ? 'bg-red-100 text-red-600' : lead.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{lead.priority} Priority</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <User size={14} /> {lead.contactPerson}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={14} /> {lead.location}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Target size={14} /> {lead.leadType}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  Potential: {formatCurrency(lead.potentialValue)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {hasPermission('leads', 'edit') && (
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                <Edit size={14} /> Edit
              </button>
            )}
            {hasPermission('leads', 'create') && (
              <>
                <button onClick={() => setActivityOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                  <Plus size={14} /> Add Activity
                </button>
                <button onClick={() => setQuoteOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                  <FileText size={14} /> Create Quotation
                </button>
              </>
            )}
            {lead.stage !== 'Won' && lead.stage !== 'Lost' && hasPermission('leads', 'edit') && (
              <button
                onClick={() => setConvertOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg font-medium"
                style={{ background: '#16a34a' }}
              >
                <UserCheck size={14} /> Convert
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Lead Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 text-sm mb-4">Lead Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Company', value: lead.companyName },
                { label: 'Contact Person', value: lead.contactPerson },
                { label: 'Email', value: lead.email },
                { label: 'Phone', value: lead.phone },
                { label: 'Location', value: lead.location },
                { label: 'Industry', value: lead.industry },
                { label: 'Lead Type', value: lead.leadType },
                { label: 'Source', value: lead.source },
                { label: 'Created Date', value: lead.createdDate },
                { label: 'Assigned To', value: lead.assignedTo },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-xs font-medium text-slate-400 mb-0.5">{f.label}</div>
                  <div className="text-sm text-slate-800">{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunity */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 text-sm mb-4">Opportunity</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-slate-400 mb-0.5">Potential Value</div>
                <div className="text-2xl font-bold font-display text-slate-900">{formatCurrency(lead.potentialValue)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 mb-0.5">Win Probability</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${lead.probability}%`, background: '#2563eb' }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{lead.probability}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 mb-0.5">Expected Close</div>
                <div className="text-sm text-slate-800">{lead.expectedClose || '—'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 mb-0.5">Sales Stage</div>
                <StatusBadge status={lead.stage} />
              </div>
              {lead.nextFollowUp && (
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-0.5">Next Follow-up</div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-800">
                    <Clock size={13} className="text-amber-500" /> {lead.nextFollowUp}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 text-sm mb-4">Activity Timeline</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100" />
              <div className="space-y-4">
                {lead.activities.slice().reverse().map(activity => (
                  <div key={activity.id} className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 relative z-10 text-sm">
                      {ACTIVITY_ICONS[activity.type] ?? '📌'}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium text-slate-800">{activity.title}</div>
                        <div className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">{activity.date}</div>
                      </div>
                      <div className="text-sm text-slate-500 mt-0.5">{activity.description}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{activity.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Insights */}
        <div className="space-y-4">
          {/* AI Insight */}
          <AIInsightCard
            title="AI Lead Insight"
            insight={AI_INSIGHTS[lead.id] ?? 'Analyse this lead\'s activity and engagement patterns to identify the best next action.'}
            onAskAI={() => navigate('/ai-assistant')}
          />

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 text-left">
                <Phone size={14} className="text-blue-500" /> Call {lead.contactPerson}
              </button>
              <button className="w-full flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 text-left">
                <Mail size={14} className="text-blue-500" /> Send Email
              </button>
              <button onClick={() => setQuoteOpen(true)} className="w-full flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 text-left">
                <FileText size={14} className="text-blue-500" /> Create Quotation
              </button>
              <button className="w-full flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50 text-left">
                <Calendar size={14} className="text-blue-500" /> Schedule Meeting
              </button>
            </div>
          </div>

          {/* Lead Health */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 text-sm mb-3">Lead Health</h3>
            <div className="space-y-3">
              {[
                { label: 'Win Probability', value: lead.probability, color: '#2563eb' },
                { label: 'Engagement Score', value: Math.min(100, lead.activities.length * 18), color: '#16a34a' },
                { label: 'Recency Score', value: lead.lastActivity === '2025-09-01' || lead.lastActivity === '2025-09-02' ? 85 : 55, color: '#f59e0b' },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{m.label}</span>
                    <span className="font-medium text-slate-700">{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Convert Modal */}
      <Modal open={convertOpen} onClose={() => setConvertOpen(false)} title="Convert Lead to Customer" subtitle={lead.companyName} size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setConvertOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={() => { setConvertOpen(false); navigate('/crm/customers'); }} className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{ background: '#16a34a' }}>
              <UserCheck size={14} className="inline mr-1.5" /> Convert & Create Account
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-green-50 border border-green-200">
            <p className="text-sm text-green-800 font-medium">Converting this lead will:</p>
            <ul className="text-sm text-green-700 mt-2 space-y-1 list-disc list-inside">
              <li>Create a new customer account for {lead.companyName}</li>
              <li>Move the lead to Won status</li>
              <li>Enable order and invoice creation</li>
              <li>Attribute this conversion to {lead.source}</li>
            </ul>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Customer Type</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
              <option>{lead.leadType}</option>
              {['Retailer', 'Wholesaler', 'Distributor', 'Business', 'Enterprise'].filter(t => t !== lead.leadType).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Account Owner</label>
            <input defaultValue={lead.assignedTo} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </Modal>

      {/* Quotation Modal */}
      <Modal open={quoteOpen} onClose={() => setQuoteOpen(false)} title="Create Quotation" subtitle={`For ${lead.companyName}`} size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setQuoteOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={() => { setQuoteOpen(false); navigate('/sales/quotations'); }} className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{ background: '#2563eb' }}>
              Create Quotation
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Valid Until</label>
              <input type="date" defaultValue="2025-10-03" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Discount %</label>
              <input type="number" defaultValue="5" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Products</label>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr><th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Product</th><th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Price</th><th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Qty</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100"><td className="px-3 py-2 text-slate-700">Enterprise CRM Suite</td><td className="px-3 py-2 text-right">₹48,000</td><td className="px-3 py-2 text-right"><input type="number" defaultValue={1} className="w-12 text-right border border-slate-200 rounded px-1 py-0.5 text-xs" /></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Notes</label>
            <textarea rows={2} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none" placeholder="Terms and conditions..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
