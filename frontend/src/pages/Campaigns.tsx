import { Megaphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import AccessDenied from './AccessDenied';
import { formatCurrency } from '../data/mockData';

export default function Campaigns() {
  const { hasModule, campaigns } = useApp();
  if (!hasModule('campaigns')) return <AccessDenied />;

  const active = campaigns.filter(c => c.status === 'Active').length;
  const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Campaigns</h1>
        <p className="text-slate-500 mt-1 text-sm">Track marketing campaign performance and ROI.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Active Campaigns" value={`${active}`} accent="#2563eb" />
        <KPICard title="Total Reach" value={totalReach > 0 ? `${(totalReach / 1000).toFixed(0)}K` : '0'} accent="#16a34a" />
        <KPICard title="Engagement" value={campaigns.length > 0 ? `${Math.round(campaigns.reduce((s, c) => s + c.engagement, 0) / 1000)}K` : '0'} accent="#7c3aed" />
        <KPICard title="Leads Generated" value={`${totalLeads}`} accent="#f59e0b" />
        <KPICard title="Conversions" value={`${totalConversions}`} accent="#16a34a" />
        <KPICard title="Attributed Revenue" value={formatCurrency(totalRevenue)} accent="#2563eb" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Campaign', 'Platform', 'Start', 'End', 'Budget', 'Spend', 'Reach', 'Leads', 'Conv.', 'Revenue', 'ROI', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-12 text-center text-slate-400">
                    <Megaphone size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No active marketing campaigns</p>
                    <p className="text-xs text-slate-400 mt-1">Campaign tracking data will appear here once marketing activities launch.</p>
                  </td>
                </tr>
              ) : (
                campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.platform === 'LinkedIn' ? 'bg-blue-100 text-blue-700' : c.platform === 'Instagram' ? 'bg-pink-100 text-pink-700' : c.platform === 'Facebook' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                        {c.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.startDate}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.endDate}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(c.budget)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(c.spend)}</td>
                    <td className="px-4 py-3 text-slate-700">{c.reach.toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{c.leads}</td>
                    <td className="px-4 py-3 font-medium text-green-600">{c.conversions}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(c.revenue)}</td>
                    <td className="px-4 py-3"><span className="text-sm font-bold text-blue-600">{c.roi}×</span></td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} dot /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
