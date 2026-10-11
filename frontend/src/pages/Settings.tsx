import { useState } from 'react';
import { Building2, Bell, Shield, Globe, CreditCard, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AccessDenied from './AccessDenied';

export default function Settings() {
  const { hasModule, company } = useApp();
  const [activeSection, setActiveSection] = useState('company');

  if (!hasModule('settings')) return <AccessDenied />;

  const sections = [
    { id: 'company', label: 'Company Profile', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'regional', label: 'Regional', icon: Globe },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Enterprise Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Configure governance, organization details, and compliance for {company.companyName}.</p>
      </div>

      <div className="flex gap-6">
        {/* Nav */}
        <div className="w-52 flex-shrink-0">
          <div className="space-y-1">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${activeSection === s.id ? 'bg-amber-50 text-[#9A3412] font-semibold border border-[#D97706]/30' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon size={15} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          {activeSection === 'company' && (
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-semibold text-slate-900">Verified Corporate Entity</h2>
                  <p className="text-xs text-slate-500">Tenant ID: <span className="font-mono text-amber-700 font-semibold">{company.tenantId}</span></p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Shield size={12} className="text-emerald-600" /> Verified Tenant
                </span>
              </div>

              {[
                { label: 'Legal Company Name', defaultValue: company.companyName },
                { label: 'Authorized Owner', defaultValue: `${company.ownerName} (${company.ownerDesignation || 'Managing Director'})` },
                { label: 'Business Email', defaultValue: company.ownerEmail },
                { label: 'Phone', defaultValue: company.ownerPhone },
                { label: 'Registered Address', defaultValue: `${company.registeredAddress}, ${company.city}, ${company.state} - ${company.pincode}` },
                { label: 'GSTIN Registration', defaultValue: company.gstin },
                { label: 'Company PAN', defaultValue: company.panNumber },
                { label: 'Corporate ID (CIN)', defaultValue: company.cinNumber || 'Not provided' },
                { label: 'Industry Vertical', defaultValue: company.industry },
                { label: 'Compliance & Verification', defaultValue: company.complianceCert || 'Verified' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  <input readOnly defaultValue={f.defaultValue} className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-not-allowed" />
                </div>
              ))}
              <div className="pt-2 text-xs text-slate-400">
                Verified authenticity credentials are locked to preserve tenant audit compliance.
              </div>
            </div>
          )}
          {activeSection === 'notifications' && (
            <div className="space-y-4 max-w-lg">
              <h2 className="font-semibold text-slate-800 mb-4">Notification Preferences</h2>
              {[
                { label: 'New lead created', desc: 'When a new lead is added to the CRM' },
                { label: 'Invoice overdue', desc: 'When an invoice passes its due date' },
                { label: 'Low stock alert', desc: 'When a product falls below reorder level' },
                { label: 'Campaign milestone', desc: 'When a campaign reaches a lead target' },
                { label: 'Quotation accepted', desc: 'When a prospect accepts a quotation' },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{n.label}</div>
                    <div className="text-xs text-slate-400">{n.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          )}
          {(activeSection === 'security' || activeSection === 'regional' || activeSection === 'billing') && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="text-4xl mb-3">⚙️</div>
              <div className="text-sm font-medium">Settings section coming soon</div>
              <div className="text-xs mt-1">{sections.find(s => s.id === activeSection)?.label} configuration</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
