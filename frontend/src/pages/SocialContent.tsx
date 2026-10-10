import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Filter, Eye, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AIInsightCard from '../components/ui/AIInsightCard';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { socialPosts, campaigns, formatCurrency } from '../data/mockData';

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: 'bg-pink-100 text-pink-700',
  Facebook: 'bg-blue-100 text-blue-700',
  LinkedIn: 'bg-blue-100 text-sky-700',
};

export default function SocialContent() {
  const { hasModule } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);

  if (!hasModule('social-content')) return <AccessDenied />;

  const filtered = socialPosts.filter(p => {
    const matchFilter = filter === 'All' || p.status === filter;
    const matchPlatform = platform === 'All' || p.platform === platform;
    return matchFilter && matchPlatform;
  });

  const published = socialPosts.filter(p => p.status === 'Published').length;
  const totalReach = socialPosts.reduce((s, p) => s + p.reach, 0);
  const totalLeads = socialPosts.reduce((s, p) => s + p.leadsGenerated, 0);
  const totalRevenue = socialPosts.reduce((s, p) => s + p.revenueAttributed, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Social Content</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage social media content and track lead generation performance.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
          <Plus size={15} /> Create Content
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Published Posts" value={`${published}`} accent="#16a34a" />
        <KPICard title="Total Reach" value={totalReach.toLocaleString()} accent="#2563eb" />
        <KPICard title="Leads Generated" value={`${totalLeads}`} change="Cross-platform" accent="#7c3aed" />
        <KPICard title="Attributed Revenue" value={formatCurrency(totalRevenue)} accent="#f59e0b" />
      </div>

      {/* Visual Marketing-to-Customer Attribution Funnel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Marketing-to-CRM Lead Attribution Flow
            </div>
            <div className="text-[11px] text-slate-500">
              Visual path illustrating how social outreach directly populates the CRM pipeline and generates revenue
            </div>
          </div>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Ecosystem Flow
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-center">
          {[
            { stage: 'Social Content', stat: '84.2K Reach', desc: 'Campaign Posts', bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: '📢' },
            { stage: 'Enquiries', stat: '1,280 Clicks', desc: 'Direct Interactions', bg: 'bg-indigo-50 border-indigo-200 text-indigo-800', icon: '💬' },
            { stage: 'Leads', stat: '126 Created', desc: 'CRM Prospects', bg: 'bg-purple-50 border-purple-200 text-purple-800', icon: '🎯' },
            { stage: 'Qualified Leads', stat: '48 Verified', desc: 'High Opportunity', bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: '⚡' },
            { stage: 'Customers', stat: '12 Won (₹8.4L)', desc: 'Converted Accounts', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: '🤝' },
          ].map((item, idx, arr) => (
            <div key={item.stage} className="flex items-center gap-2">
              <div className={`flex-1 p-3 rounded-xl border ${item.bg} text-center`}>
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-xs font-bold">{item.stage}</div>
                <div className="text-xs font-bold mt-0.5">{item.stat}</div>
                <div className="text-[10px] opacity-75">{item.desc}</div>
              </div>
              {idx < arr.length - 1 && (
                <span className="hidden lg:inline text-slate-300 font-bold text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {['All', 'Published', 'Scheduled', 'Draft'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{s}</button>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {['All', 'Instagram', 'Facebook', 'LinkedIn'].map(p => (
            <button key={p} onClick={() => setPlatform(p)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${platform === p ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all">
            {/* Post preview */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PLATFORM_COLORS[post.platform] ?? ''}`}>{post.platform}</span>
                <StatusBadge status={post.status} dot />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm mb-2">{post.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{post.content}</p>
              {post.publishDate && (
                <div className="text-xs text-slate-400 mt-2">{post.status === 'Published' ? 'Published' : 'Scheduled'}: {post.publishDate}</div>
              )}
            </div>

            {/* Metrics */}
            {post.status === 'Published' ? (
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Reach', value: post.reach.toLocaleString() },
                    { label: 'Likes', value: post.likes.toLocaleString() },
                    { label: 'Clicks', value: post.clicks.toLocaleString() },
                  ].map(m => (
                    <div key={m.label} className="text-center p-2 rounded-lg bg-slate-50">
                      <div className="font-semibold text-slate-800 text-sm">{m.value}</div>
                      <div className="text-xs text-slate-400">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 border border-purple-100">
                  <div>
                    <div className="text-xs text-purple-600 font-medium">Leads generated</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-purple-700">{post.leadsGenerated}</span>
                      <span className="text-xs text-purple-500">{post.qualifiedLeads} qualified</span>
                      <span className="text-xs text-green-600 font-medium">{post.conversions} converted</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Revenue</div>
                    <div className="text-sm font-bold text-slate-800">{formatCurrency(post.revenueAttributed)}</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/crm/leads')}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
                >
                  <Eye size={12} /> View Generated Leads <ChevronRight size={11} />
                </button>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                {post.status === 'Draft' ? 'Draft — not yet published' : `Scheduled for ${post.publishDate}`}
              </div>
            )}
          </div>
        ))}
      </div>

      <AIInsightCard
        insight="LinkedIn campaigns are generating fewer leads but higher-value opportunities (avg ₹4.8L vs ₹2.2L for Instagram). The Wholesale Partner Campaign on Instagram has the highest lead volume but lower conversion value. Consider increasing LinkedIn budget for Q4 to optimise for revenue rather than volume."
      />

      {/* Create Content Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Social Content" subtitle="Draft a new social media post" size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600">Cancel</button>
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600">Save Draft</button>
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{ background: '#2563eb' }}>Schedule</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Post Title</label>
            <input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Internal title for this post" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Platform</label>
              <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
                {['Instagram', 'Facebook', 'LinkedIn'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Campaign</label>
              <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
                {campaigns.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Content</label>
            <textarea rows={4} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500" placeholder="Write your post content..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Publish Date & Time</label>
            <input type="datetime-local" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
