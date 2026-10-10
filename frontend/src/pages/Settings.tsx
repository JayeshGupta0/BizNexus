import { useState } from 'react';
import { Building2, Bell, Shield, Globe, CreditCard, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AccessDenied from './AccessDenied';

export default function Settings() {
  const { hasModule } = useApp();
  const [activeSection, setActiveSection] = useState('company');

  if (!hasModule('settings')) return <AccessDenied />;

  const sections = [
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'regional', label: 'Regional', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Configure BizNexuz for your organisation.</p>
      </div>

      <div className="flex gap-6">
        {/* Nav */}
        <div className="w-48 flex-shrink-0">
          <div className="space-y-1">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${activeSection === s.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon size={15} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
          {activeSection === 'company' && (
            <div className="space-y-4 max-w-lg">
              <h2 className="font-semibold text-slate-800 mb-4">Company Information</h2>
              {[
                { label: 'Company Name', defaultValue: 'BizNexuz Pvt. Ltd.' },
                { label: 'Business Email', defaultValue: 'admin@biznexuz.com' },
                { label: 'Phone', defaultValue: '+91 98765 43210' },
                { label: 'Address', defaultValue: 'Level 12, Commercial Tower, Mumbai 400001' },
                { label: 'GSTIN', defaultValue: 'GSTIN27BNX12345F1Z5' },
                { label: 'Industry', defaultValue: 'Technology / SaaS' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">{f.label}</label>
                  <input defaultValue={f.defaultValue} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl font-medium mt-2" style={{ background: '#2563eb' }}>
                <Save size={14} /> Save Changes
              </button>
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
