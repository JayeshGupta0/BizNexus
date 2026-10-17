import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Filter, Eye, ChevronRight, Zap, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AIInsightCard from '../components/ui/AIInsightCard';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type SocialPost } from '../data/mockData';

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: 'bg-pink-100 text-pink-700',
  Facebook: 'bg-blue-100 text-blue-700',
  LinkedIn: 'bg-blue-100 text-sky-700',
};

export default function SocialContent() {
  const { hasModule, socialPosts, campaigns, addSocialPost, authMode } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [platform, setPlatform] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    platform: 'LinkedIn' as const,
    content: '',
    publishDate: '',
  });

  if (!hasModule('social-content')) return <AccessDenied />;

  const isRealClean = authMode === 'real' && socialPosts.length === 0;

  const filtered = socialPosts.filter(p => {
    const matchFilter = filter === 'All' || p.status === filter;
    const matchPlatform = platform === 'All' || p.platform === platform;
    return matchFilter && matchPlatform;
  });

  const published = socialPosts.filter(p => p.status === 'Published').length;
  const totalReach = socialPosts.reduce((s, p) => s + p.reach, 0);
  const totalLeads = socialPosts.reduce((s, p) => s + p.leadsGenerated, 0);
  const totalRevenue = socialPosts.reduce((s, p) => s + p.revenueAttributed, 0);

  const handleCreatePost = () => {
    if (!form.title || !form.content) return;
    const newPost: SocialPost = {
      id: `sp-${Date.now()}`,
      title: form.title.trim(),
      platform: form.platform as any,
      content: form.content.trim(),
      status: 'Scheduled',
      publishDate: form.publishDate || new Date().toISOString().split('T')[0],
      reach: 0,
      likes: 0,
      clicks: 0,
      leadsGenerated: 0,
      revenueAttributed: 0,
      crmTag: 'Direct Outreach',
    };
    addSocialPost(newPost);
    setForm({ title: '', platform: 'LinkedIn', content: '', publishDate: '' });
    setCreateOpen(false);
  };

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
        <KPICard title="Total Reach" value={totalReach > 0 ? totalReach.toLocaleString() : '0'} accent="#2563eb" />
        <KPICard title="Leads Generated" value={`${totalLeads}`} change={!isRealClean ? "Cross-platform" : undefined} accent="#7c3aed" />
        <KPICard title="Attributed Revenue" value={formatCurrency(totalRevenue)} accent="#f59e0b" />
      </div>

      {/* Visual Marketing-to-Customer Attribution Funnel */}
      {!isRealClean && (
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
      )}

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

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Share2 size={36} className="mx-auto mb-2 text-slate-300" />
          <h3 className="font-semibold text-slate-700 text-sm">No Social Posts</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {socialPosts.length === 0 ? 'No social media posts created yet. Click "+ Create Content" to draft or schedule content across platforms.' : 'No posts match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(post => (
            <div key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all">
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
                    <span className="text-xs text-purple-700 font-medium">Attributed: {post.leadsGenerated} Leads</span>
                    <span className="text-xs font-semibold text-purple-900">{formatCurrency(post.revenueAttributed)}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-xs text-slate-400 text-center">
                  Metrics will activate once post is published.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Social Content" size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600">Cancel</button>
            <button onClick={handleCreatePost} disabled={!form.title || !form.content} className="px-4 py-2 text-sm text-white rounded-xl font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>Schedule</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Post Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Internal title for this post" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Platform</label>
              <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value as any })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
                {['Instagram', 'Facebook', 'LinkedIn'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Publish Date</label>
              <input type="date" value={form.publishDate} onChange={e => setForm({ ...form, publishDate: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Content *</label>
            <textarea rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-blue-500" placeholder="Write your post content..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}
