import { useState } from 'react';
import { Shield, Plus, Edit, UserX, RefreshCw, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { useApp, DEFAULT_ROLE_PERMISSIONS, ROLE_MODULES, type Permission } from '../context/AppContext';
import { demoUsers } from '../data/mockData';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';

const MODULES_LIST = [
  'leads', 'customers', 'sales-orders', 'quotations', 'products', 'inventory',
  'purchases', 'suppliers', 'finance', 'invoices', 'payments', 'expenses',
  'social-content', 'campaigns', 'analytics', 'documents', 'ai-assistant',
  'users-roles', 'settings',
];

const MODULE_LABELS: Record<string, string> = {
  leads: 'Leads & Pipeline', customers: 'Customers', 'sales-orders': 'Sales Orders',
  quotations: 'Quotations', products: 'Products', inventory: 'Inventory',
  purchases: 'Purchases', suppliers: 'Suppliers', finance: 'Finance Overview',
  invoices: 'Invoices', payments: 'Payments', expenses: 'Expenses',
  'social-content': 'Social Content', campaigns: 'Campaigns', analytics: 'Analytics',
  documents: 'Documents', 'ai-assistant': 'AI Assistant', 'users-roles': 'Users & Roles', settings: 'Settings',
};

const PERMISSIONS: Permission[] = ['view', 'create', 'edit', 'delete', 'export', 'approve'];

const TABS = ['Users', 'Roles', 'Permissions'] as const;
type Tab = typeof TABS[number];

const ROLES = Object.keys(DEFAULT_ROLE_PERMISSIONS);

const ROLE_COLORS: Record<string, string> = {
  'Business Owner': 'bg-blue-100 text-blue-700',
  'Sales Manager': 'bg-green-100 text-green-700',
  'Sales Executive': 'bg-teal-100 text-teal-700',
  'Marketing Manager': 'bg-pink-100 text-pink-700',
  'Inventory Manager': 'bg-orange-100 text-orange-700',
  'Purchase Manager': 'bg-yellow-100 text-yellow-700',
  'Finance Manager': 'bg-purple-100 text-purple-700',
  'Business Analyst': 'bg-indigo-100 text-indigo-700',
};

export default function UsersRoles() {
  const { hasModule, currentUser, userOverrides, setUserOverride } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('Users');
  const [selectedRole, setSelectedRole] = useState<string>('Sales Executive');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  if (!hasModule('users-roles')) return <AccessDenied />;

  const selectedUserObj = demoUsers.find(u => u.id === selectedUser);
  const rolePerm = DEFAULT_ROLE_PERMISSIONS[selectedUserObj?.role ?? 'Sales Executive'] ?? {};
  const overrides = selectedUser ? (userOverrides[selectedUser] ?? []) : [];

  const effectivePermission = (userId: string, module: string, perm: Permission): boolean => {
    const user = demoUsers.find(u => u.id === userId);
    if (!user) return false;
    const base = DEFAULT_ROLE_PERMISSIONS[user.role]?.[module]?.[perm] ?? false;
    const override = (userOverrides[userId] ?? []).find(o => o.module === module && o.permission === perm);
    return override ? override.granted : base;
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Users & Roles</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage users, assign roles, and control module permissions.</p>
        </div>
        <button onClick={() => setInviteOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
          <Plus size={15} /> Invite User
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Users" value={`${demoUsers.length}`} accent="#2563eb" />
        <KPICard title="Roles" value={`${ROLES.length}`} accent="#7c3aed" />
        <KPICard title="Custom Overrides" value={`${Object.values(userOverrides).flat().length}`} accent="#f59e0b" />
        <KPICard title="Pending Invites" value="0" accent="#16a34a" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{tab}</button>
        ))}
      </div>

      {/* ── Users tab ──────────────────────────────────────────────────── */}
      {activeTab === 'Users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['User', 'Role', 'Department', 'Module Access', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {demoUsers.map(user => {
                  const modules = ROLE_MODULES[user.role] ?? [];
                  const isExpanded = expandedUser === user.id;
                  return (
                    <>
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: '#2563eb' }}>
                              {user.avatar}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{user.name}</div>
                              <div className="text-xs text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role] ?? 'bg-slate-100 text-slate-600'}`}>{user.role}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{user.department}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-slate-700">{modules.length}</span>
                            <span className="text-xs text-slate-400">modules</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status="Active" dot /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setSelectedUser(user.id); setExpandedUser(isExpanded ? null : user.id); }}
                              className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100"
                            >
                              <Shield size={11} /> Permissions {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><Edit size={13} /></button>
                          </div>
                        </td>
                      </tr>

                      {/* Inline permission overrides */}
                      {isExpanded && (
                        <tr key={`${user.id}-override`}>
                          <td colSpan={6} className="px-4 py-4 bg-slate-50">
                            {/* Visual Explanation of Authority Equation */}
                            <div className="mb-3 bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-3">
                              <div className="flex items-center gap-2">
                                <Shield size={16} className="text-blue-600" />
                                <div>
                                  <div className="text-xs font-bold text-slate-800">
                                    Individual User Authority Equation
                                  </div>
                                  <div className="text-[11px] text-slate-600">
                                    The Business Owner can grant or restrict custom capabilities per individual without altering the global role.
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-slate-800 shadow-sm">
                                <span className="text-blue-600">Role Permissions</span>
                                <span className="text-slate-400">✕</span>
                                <span className="text-amber-600">Individual Overrides</span>
                                <span className="text-slate-400">=</span>
                                <span className="text-emerald-600">Effective Permissions</span>
                              </div>
                            </div>

                            <div className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center justify-between">
                              <span className="flex items-center gap-2"><Shield size={12} /> Custom Overrides for {user.name} ({user.role})</span>
                              {user.name === 'Rahul Sharma' && (
                                <span className="text-[11px] font-normal normal-case text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  ⭐ Example Case: Customer Export explicitly enabled for Sales Executive
                                </span>
                              )}
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-3 py-2 text-left font-semibold text-slate-500">Module</th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-400">Role Default</th>
                                    {PERMISSIONS.map(p => <th key={p} className="px-2 py-2 text-center font-semibold text-slate-500 capitalize">{p}</th>)}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                  {MODULES_LIST.slice(0, 10).map(mod => {
                                    const basePerm = DEFAULT_ROLE_PERMISSIONS[user.role]?.[mod];
                                    if (!basePerm) return null;
                                    return (
                                      <tr key={mod} className="hover:bg-slate-50">
                                        <td className="px-3 py-2 font-medium text-slate-700">{MODULE_LABELS[mod]}</td>
                                        <td className="px-3 py-2">
                                          <div className="flex gap-0.5">
                                            {PERMISSIONS.filter(p => basePerm[p]).map(p => (
                                              <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 font-medium uppercase">{p.slice(0, 1)}</span>
                                            ))}
                                          </div>
                                        </td>
                                        {PERMISSIONS.map(perm => {
                                          const effective = effectivePermission(user.id, mod, perm);
                                          const hasOverride = overrides.some(o => o.module === mod && o.permission === perm);
                                          return (
                                            <td key={perm} className="px-2 py-2 text-center">
                                              <button
                                                onClick={() => setUserOverride(user.id, mod, perm, !effective)}
                                                className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto transition-colors ${effective ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'} ${hasOverride ? 'ring-2 ring-amber-400' : ''}`}
                                                title={`${effective ? 'Revoke' : 'Grant'} ${perm}${hasOverride ? ' (overridden)' : ''}`}
                                              >
                                                {effective ? <Check size={10} /> : <X size={10} />}
                                              </button>
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                              <span className="w-3 h-3 rounded border-2 border-amber-400 inline-block" /> Highlighted cells have individual overrides applied on top of role defaults.
                            </p>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Roles tab ──────────────────────────────────────────────────── */}
      {activeTab === 'Roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {ROLES.map(role => {
            const users = demoUsers.filter(u => u.role === role);
            const modules = ROLE_MODULES[role as keyof typeof ROLE_MODULES] ?? [];
            return (
              <div key={role} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[role] ?? 'bg-slate-100 text-slate-600'}`}>{role}</div>
                  <button className="p-1 rounded text-slate-400 hover:text-slate-600"><Edit size={12} /></button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-1">
                    {users.slice(0, 3).map(u => (
                      <div key={u.id} className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold border border-white">{u.avatar}</div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{users.length} user{users.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="text-xs text-slate-500 mb-2">{modules.length} modules</div>
                <div className="flex flex-wrap gap-1">
                  {modules.slice(0, 4).map(m => (
                    <span key={m} className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{MODULE_LABELS[m]?.split(' ')[0]}</span>
                  ))}
                  {modules.length > 4 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400">+{modules.length - 4} more</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Permissions tab ───────────────────────────────────────────── */}
      {activeTab === 'Permissions' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Role:</label>
            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-blue-500" />
                <span className="font-semibold text-slate-800 text-sm">Permission Matrix — {selectedRole}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 min-w-48">Module</th>
                    {PERMISSIONS.map(p => (
                      <th key={p} className="px-3 py-3 text-center text-xs font-semibold text-slate-500 capitalize min-w-20">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MODULES_LIST.map(mod => {
                    const perm = (DEFAULT_ROLE_PERMISSIONS as Record<string, Record<string, Record<Permission, boolean>>>)[selectedRole]?.[mod];
                    const accessible = ROLE_MODULES[selectedRole as keyof typeof ROLE_MODULES]?.includes(mod);
                    return (
                      <tr key={mod} className={accessible ? 'hover:bg-slate-50' : 'opacity-40'}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-700">{MODULE_LABELS[mod]}</div>
                          {!accessible && <div className="text-xs text-slate-400">No access</div>}
                        </td>
                        {PERMISSIONS.map(p => (
                          <td key={p} className="px-3 py-3 text-center">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto ${perm?.[p] ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
                              {perm?.[p] ? <Check size={11} /> : <X size={11} />}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite User" subtitle="Add a new team member" size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setInviteOpen(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600">Cancel</button>
            <button onClick={() => setInviteOpen(false)} className="px-4 py-2 text-sm text-white rounded-xl font-medium" style={{ background: '#2563eb' }}>Send Invitation</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-slate-600 mb-1.5">First Name</label><input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1.5">Last Name</label><input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" /></div>
          </div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address</label><input type="email" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="user@company.com" /></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1.5">Role</label><select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500">{ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-slate-600 mb-1.5">Department</label><input className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" /></div>
        </div>
      </Modal>
    </div>
  );
}
