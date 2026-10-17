import { useState, useEffect } from 'react';
import { Shield, Plus, Edit, UserX, RefreshCw, ChevronDown, ChevronUp, Check, X, UserPlus, Save, Lock, Loader2, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import { useApp, DEFAULT_ROLE_PERMISSIONS, ROLE_MODULES, type Permission } from '../context/AppContext';
import { demoUsers, type Role, type DemoUser } from '../data/mockData';
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

const DEPARTMENTS = ['Executive', 'Sales', 'Marketing', 'Operations', 'Procurement', 'Finance', 'Analytics', 'Engineering', 'HR', 'Support'];

const initialAddUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'Sales Executive' as Role,
  password: '',
  department: 'Sales',
};

export default function UsersRoles() {
  const {
    hasModule, currentUser, userOverrides, setUserOverride,
    rolePermissions, setRolePermission, saveRolePermissions,
    availableUsers, addUser, updateUser, deleteUser, saveUserPermissions, authMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('Users');
  const [selectedRole, setSelectedRole] = useState<string>('Sales Executive');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [addUserApiError, setAddUserApiError] = useState('');
  const [addUserForm, setAddUserForm] = useState(initialAddUserForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Draft Permissions state for explicit Save Button
  const [draftPerms, setDraftPerms] = useState<Record<string, Record<Permission, boolean>>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savingPerms, setSavingPerms] = useState(false);
  const [permSuccessMessage, setPermSuccessMessage] = useState('');

  // Sync draft permissions whenever selectedRole or rolePermissions changes
  useEffect(() => {
    const current = (rolePermissions as any)[selectedRole] || (DEFAULT_ROLE_PERMISSIONS as any)[selectedRole] || {};
    setDraftPerms(JSON.parse(JSON.stringify(current)));
    setHasUnsavedChanges(false);
  }, [selectedRole, rolePermissions]);

  // Edit User State
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserForm, setEditUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Sales Executive' as Role,
    department: 'Sales',
    password: '',
  });
  const [editUserErrors, setEditUserErrors] = useState<Record<string, string>>({});
  const [editUserApiError, setEditUserApiError] = useState('');
  const [editUserSuccess, setEditUserSuccess] = useState('');
  const [savingEditUser, setSavingEditUser] = useState(false);

  // User Overrides Draft State for Save Button in Users tab
  const [draftUserOverrides, setDraftUserOverrides] = useState<Record<string, Array<{ module: string; permission: Permission; granted: boolean }>>>({});
  const [userHasUnsavedChanges, setUserHasUnsavedChanges] = useState<Record<string, boolean>>({});
  const [savingUserPerms, setSavingUserPerms] = useState<Record<string, boolean>>({});
  const [userPermSuccessMessage, setUserPermSuccessMessage] = useState<Record<string, string>>({});

  const isOwnerRole = selectedRole === 'Business Owner';

  const handleToggleDraftPermission = (mod: string, p: Permission) => {
    if (isOwnerRole) return; // Administrator cannot change permissions for themselves
    setDraftPerms(prev => {
      const currentMod = prev[mod] || { view: false, create: false, edit: false, delete: false, export: false, approve: false };
      const updatedMod = { ...currentMod, [p]: !currentMod[p] };
      return {
        ...prev,
        [mod]: updatedMod,
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleSavePermissions = async () => {
    if (isOwnerRole) return;
    setSavingPerms(true);
    setPermSuccessMessage('');
    try {
      await saveRolePermissions(selectedRole, draftPerms);
      setHasUnsavedChanges(false);
      setPermSuccessMessage(`Permissions for "${selectedRole}" successfully saved to database!`);
      setTimeout(() => setPermSuccessMessage(''), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to save permissions');
    } finally {
      setSavingPerms(false);
    }
  };

  if (!hasModule('users-roles')) return <AccessDenied />;

  const userList = authMode === 'real'
    ? (availableUsers ?? [])
    : (availableUsers && availableUsers.length > 0 ? availableUsers : demoUsers);
  const selectedUserObj = userList.find(u => u.id === selectedUser);
  const rolePerm = (rolePermissions[selectedUserObj?.role ?? 'Sales Executive'] ?? DEFAULT_ROLE_PERMISSIONS[selectedUserObj?.role ?? 'Sales Executive']) ?? {};
  const overrides = selectedUser ? (draftUserOverrides[selectedUser] ?? (userOverrides[selectedUser] ?? [])) : [];
  const uniqueDepartments = new Set(userList.map(u => u.department));

  const effectivePermission = (userId: string, module: string, perm: Permission): boolean => {
    const user = userList.find(u => u.id === userId);
    if (!user) return false;
    if (user.role === 'Business Owner') return true; // Admin has permanent full access
    const base = (rolePermissions[user.role]?.[module] ?? DEFAULT_ROLE_PERMISSIONS[user.role]?.[module])?.[perm] ?? false;
    const currentOverrides = draftUserOverrides[userId] ?? (userOverrides[userId] ?? []);
    const override = currentOverrides.find(o => o.module === module && o.permission === perm);
    return override ? override.granted : base;
  };

  const handleToggleDraftUserOverride = (userId: string, mod: string, perm: Permission, currentEffective: boolean) => {
    const targetUser = userList.find(u => u.id === userId);
    if (targetUser?.role === 'Business Owner') return; // Admin cannot modify their own permissions

    setDraftUserOverrides(prev => {
      const currentList = prev[userId] ?? (userOverrides[userId] ?? []);
      const filtered = currentList.filter(o => !(o.module === mod && o.permission === perm));
      const nextList = [...filtered, { module: mod, permission: perm, granted: !currentEffective }];
      return { ...prev, [userId]: nextList };
    });
    setUserHasUnsavedChanges(prev => ({ ...prev, [userId]: true }));
  };

  const handleSaveUserPermissions = async (userId: string) => {
    const targetUser = userList.find(u => u.id === userId);
    if (targetUser?.role === 'Business Owner') return;

    setSavingUserPerms(prev => ({ ...prev, [userId]: true }));
    try {
      const listToSave = draftUserOverrides[userId] ?? (userOverrides[userId] ?? []);
      await saveUserPermissions(userId, listToSave);
      setUserHasUnsavedChanges(prev => ({ ...prev, [userId]: false }));
      setUserPermSuccessMessage(prev => ({ ...prev, [userId]: `Saved permissions for ${targetUser?.name || 'user'}!` }));
      setTimeout(() => {
        setUserPermSuccessMessage(prev => ({ ...prev, [userId]: '' }));
      }, 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to save user permissions');
    } finally {
      setSavingUserPerms(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleOpenEditUser = (user: DemoUser) => {
    setEditingUserId(user.id);
    const names = user.name ? user.name.split(' ') : ['', ''];
    setEditUserForm({
      firstName: user.firstName || names[0] || '',
      lastName: user.lastName || names.slice(1).join(' ') || '',
      email: user.email,
      role: user.role,
      department: user.department || 'Sales',
      password: '',
    });
    setEditUserErrors({});
    setEditUserApiError('');
    setEditUserSuccess('');
    setEditUserOpen(true);
  };

  const handleSaveEditUser = async () => {
    if (!editingUserId) return;
    const errors: Record<string, string> = {};
    if (!editUserForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!editUserForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (!editUserForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUserForm.email)) errors.email = 'Invalid email format';
    if (editUserForm.password && editUserForm.password.length < 6) errors.password = 'Min 6 characters';

    if (Object.keys(errors).length > 0) {
      setEditUserErrors(errors);
      return;
    }

    setSavingEditUser(true);
    setEditUserApiError('');
    try {
      await updateUser(editingUserId, {
        firstName: editUserForm.firstName.trim(),
        lastName: editUserForm.lastName.trim(),
        email: editUserForm.email.trim(),
        role: editUserForm.role,
        department: editUserForm.department,
        password: editUserForm.password.trim() || undefined,
      });
      setEditUserSuccess('User updated successfully!');
      setTimeout(() => {
        setEditUserSuccess('');
        setEditUserOpen(false);
        setEditingUserId(null);
      }, 1500);
    } catch (err: any) {
      setEditUserApiError(err.message || 'Failed to update user');
    } finally {
      setSavingEditUser(false);
    }
  };

  const handleDeleteUser = async (user: DemoUser) => {
    if (user.role === 'Business Owner' || user.id === currentUser.id) {
      alert('Cannot delete company administrator or your own active account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${user.name} (${user.email})? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser(user.id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };


  const updateField = (field: string, value: string) => {
    setAddUserForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!addUserForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!addUserForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (!addUserForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addUserForm.email)) errors.email = 'Invalid email format';
    if (!addUserForm.password.trim()) errors.password = 'Password is required';
    else if (addUserForm.password.length < 6) errors.password = 'Min 6 characters';
    if (!addUserForm.department.trim()) errors.department = 'Department is required';
    setFormErrors(errors ?? {});
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;
    setAddUserApiError('');
    try {
      await addUser({
        firstName: addUserForm.firstName.trim(),
        lastName: addUserForm.lastName.trim(),
        email: addUserForm.email.trim(),
        role: addUserForm.role,
        password: addUserForm.password,
        department: addUserForm.department.trim(),
      });
      setSuccessMessage(`${addUserForm.firstName} ${addUserForm.lastName} has been added successfully as ${addUserForm.role}.`);
      setAddUserForm(initialAddUserForm);
      setFormErrors({});
      setTimeout(() => {
        setSuccessMessage('');
        setAddUserOpen(false);
      }, 2000);
    } catch (err: any) {
      setAddUserApiError(err.message || 'Failed to add user. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setAddUserOpen(false);
    setAddUserForm(initialAddUserForm);
    setFormErrors({});
    setSuccessMessage('');
    setAddUserApiError('');
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-colors ${(formErrors ?? {})[field] ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Users & Roles</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage users, assign roles, and control module permissions.</p>
        </div>
        <button onClick={() => setAddUserOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
          <UserPlus size={15} /> Add User
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Users" value={`${userList.length}`} accent="#2563eb" />
        <KPICard title="Roles" value={`${ROLES.length}`} accent="#7c3aed" />
        <KPICard title="Custom Overrides" value={`${Object.values(userOverrides).flat().length}`} accent="#f59e0b" />
        <KPICard title="Departments" value={`${uniqueDepartments.size}`} accent="#16a34a" />
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
          {userList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <UserPlus size={24} className="text-blue-500" />
              </div>
              <div className="font-semibold text-slate-800 mb-1">No team members yet</div>
              <p className="text-sm text-slate-400 mb-4 max-w-xs">Invite your team by clicking "Add User". They'll be able to log in and access modules based on their assigned role.</p>
              <button onClick={() => setAddUserOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
                <UserPlus size={14} /> Add First User
              </button>
            </div>
          ) : (
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
                {userList.map(user => {
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
                              className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 cursor-pointer"
                            >
                              <Shield size={11} /> Permissions {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                            </button>
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Edit user details"
                            >
                              <Edit size={13} />
                            </button>
                            {user.role !== 'Business Owner' && user.id !== currentUser.id && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Delete user"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Inline permission overrides */}
                      {isExpanded && (
                        <tr key={`${user.id}-override`}>
                          <td colSpan={6} className="px-4 py-4 bg-slate-50">
                            {user.role === 'Business Owner' ? (
                              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center gap-3 shadow-xs">
                                <Lock size={16} className="text-amber-700 shrink-0" />
                                <div>
                                  <span className="font-bold">Administrator / Business Owner Access is Protected: </span>
                                  As the executive authority, the Business Owner role has permanent full access across all enterprise modules. An admin cannot modify permissions for themselves.
                                </div>
                              </div>
                            ) : (
                              <>
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

                                <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
                                  <div className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-2">
                                    <Shield size={13} className="text-blue-600" /> Custom Overrides for {user.name} ({user.role})
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {userPermSuccessMessage[user.id] && (
                                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                                        <Check size={12} /> {userPermSuccessMessage[user.id]}
                                      </span>
                                    )}
                                    {userHasUnsavedChanges[user.id] && (
                                      <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Unsaved changes
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleSaveUserPermissions(user.id)}
                                      disabled={savingUserPerms[user.id] || !userHasUnsavedChanges[user.id]}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                                        userHasUnsavedChanges[user.id]
                                          ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                      }`}
                                      title="Save edited individual permissions to database"
                                    >
                                      {savingUserPerms[user.id] ? (
                                        <>
                                          <Loader2 size={12} className="animate-spin" />
                                          Saving...
                                        </>
                                      ) : (
                                        <>
                                          <Save size={12} />
                                          Save Permissions
                                        </>
                                      )}
                                    </button>
                                  </div>
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
                                              const userActiveOverrides = draftUserOverrides[user.id] ?? (userOverrides[user.id] ?? []);
                                              const hasOverride = userActiveOverrides.some(o => o.module === mod && o.permission === perm);
                                              return (
                                                <td key={perm} className="px-2 py-2 text-center">
                                                  <button
                                                    onClick={() => handleToggleDraftUserOverride(user.id, mod, perm, effective)}
                                                    className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto transition-colors cursor-pointer hover:scale-105 ${effective ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'} ${hasOverride ? 'ring-2 ring-amber-400' : ''}`}
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
                              </>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* ── Roles tab ──────────────────────────────────────────────────── */}
      {activeTab === 'Roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {ROLES.map(role => {
            const users = userList.filter(u => u.role === role);
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
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Select Role to Configure:</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 font-medium"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>
                    {r} {r === 'Business Owner' ? '(Admin - Full Access)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="text-xs text-amber-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  Unsaved Changes
                </span>
              )}
              <button
                type="button"
                onClick={handleSavePermissions}
                disabled={savingPerms || isOwnerRole || !hasUnsavedChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isOwnerRole
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : hasUnsavedChanges
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
                title={isOwnerRole ? 'Admin cannot modify permissions for themselves' : 'Save edited permissions to database'}
              >
                {savingPerms ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Saving to Database...
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    Save Permissions
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Business Owner Protection Alert */}
          {isOwnerRole && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center gap-3 shadow-xs">
              <Lock size={16} className="text-amber-700 shrink-0" />
              <div>
                <span className="font-bold">Administrator / Business Owner Access is Protected: </span>
                As the executive enterprise authority, the Business Owner role has permanent, unchangeable privileges across all modules. An admin cannot modify permissions for themselves.
              </div>
            </div>
          )}

          {/* Success message */}
          {permSuccessMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs shadow-sm animate-fade-in font-medium">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{permSuccessMessage}</span>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-blue-500" />
                <span className="font-semibold text-slate-800 text-sm">Permission Matrix — {selectedRole}</span>
              </div>
              <div className="flex items-center gap-2">
                {authMode === 'real' ? (
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                    <Check size={12} className="text-emerald-600" /> SQLite Multi-Tenant Sync
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
                    Demo Mode (In-Memory)
                  </span>
                )}
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
                    const modDraft = draftPerms[mod] || (DEFAULT_ROLE_PERMISSIONS as any)[selectedRole]?.[mod];
                    const accessible = ROLE_MODULES[selectedRole as keyof typeof ROLE_MODULES]?.includes(mod);
                    return (
                      <tr key={mod} className={accessible ? 'hover:bg-slate-50' : 'opacity-40'}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-700">{MODULE_LABELS[mod]}</div>
                          {!accessible && <div className="text-xs text-slate-400">Not assigned to role</div>}
                        </td>
                        {PERMISSIONS.map(p => {
                          const isGranted = isOwnerRole ? true : (modDraft?.[p] ?? false);
                          return (
                            <td key={p} className="px-3 py-3 text-center">
                              <button
                                type="button"
                                disabled={isOwnerRole}
                                onClick={() => handleToggleDraftPermission(mod, p)}
                                className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto transition-all ${
                                  isOwnerRole
                                    ? 'bg-blue-600/70 text-white cursor-not-allowed opacity-60'
                                    : isGranted
                                    ? 'bg-blue-600 text-white shadow-sm cursor-pointer hover:scale-110'
                                    : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-500 cursor-pointer hover:scale-110'
                                }`}
                                title={
                                  isOwnerRole
                                    ? 'Business Owner permissions are permanent and cannot be modified'
                                    : `Click to ${isGranted ? 'Revoke' : 'Grant'} ${p} for ${selectedRole}`
                                }
                              >
                                {isOwnerRole ? <Lock size={10} /> : isGranted ? <Check size={11} /> : <X size={11} />}
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
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal open={addUserOpen} onClose={handleCloseModal} title="Add User" subtitle="Create a new team member account" size="md"
        footer={
          !successMessage ? (
            <div className="flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleAddUser} className="px-4 py-2 text-sm text-white rounded-xl font-medium transition-colors hover:opacity-90" style={{ background: '#2563eb' }}>
                <span className="flex items-center gap-2"><UserPlus size={14} /> Add User</span>
              </button>
            </div>
          ) : undefined
        }
      >
        {successMessage ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check size={28} className="text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-emerald-700 text-center">{successMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">First Name <span className="text-red-400">*</span></label>
                <input
                  value={addUserForm.firstName}
                  onChange={e => updateField('firstName', e.target.value)}
                  className={inputClass('firstName')}
                  placeholder="John"
                />
                {formErrors.firstName && <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Last Name <span className="text-red-400">*</span></label>
                <input
                  value={addUserForm.lastName}
                  onChange={e => updateField('lastName', e.target.value)}
                  className={inputClass('lastName')}
                  placeholder="Doe"
                />
                {formErrors.lastName && <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address <span className="text-red-400">*</span></label>
              <input
                type="email"
                value={addUserForm.email}
                onChange={e => updateField('email', e.target.value)}
                className={inputClass('email')}
                placeholder="john.doe@company.com"
              />
              {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Role <span className="text-red-400">*</span></label>
              <select
                value={addUserForm.role}
                onChange={e => updateField('role', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Password <span className="text-red-400">*</span></label>
              <input
                type="password"
                value={addUserForm.password}
                onChange={e => updateField('password', e.target.value)}
                className={inputClass('password')}
                placeholder="Min. 6 characters"
              />
              {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Department <span className="text-red-400">*</span></label>
              <select
                value={addUserForm.department}
                onChange={e => updateField('department', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {addUserApiError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                ⚠️ {addUserApiError}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        open={editUserOpen}
        onClose={() => setEditUserOpen(false)}
        title="Edit Team Member"
        subtitle="Update profile details, role, department, or reset password"
        size="md"
        footer={
          !editUserSuccess ? (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditUserOpen(false)}
                className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditUser}
                disabled={savingEditUser}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                style={{ background: '#2563eb' }}
              >
                {savingEditUser ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Changes
              </button>
            </div>
          ) : undefined
        }
      >
        {editUserSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check size={28} className="text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-emerald-700 text-center">{editUserSuccess}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">First Name <span className="text-red-400">*</span></label>
                <input
                  value={editUserForm.firstName}
                  onChange={e => setEditUserForm(p => ({ ...p, firstName: e.target.value }))}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-colors ${editUserErrors.firstName ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`}
                  placeholder="First Name"
                />
                {editUserErrors.firstName && <p className="text-xs text-red-500 mt-1">{editUserErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Last Name <span className="text-red-400">*</span></label>
                <input
                  value={editUserForm.lastName}
                  onChange={e => setEditUserForm(p => ({ ...p, lastName: e.target.value }))}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-colors ${editUserErrors.lastName ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`}
                  placeholder="Last Name"
                />
                {editUserErrors.lastName && <p className="text-xs text-red-500 mt-1">{editUserErrors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address <span className="text-red-400">*</span></label>
              <input
                type="email"
                value={editUserForm.email}
                onChange={e => setEditUserForm(p => ({ ...p, email: e.target.value }))}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-colors ${editUserErrors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`}
                placeholder="email@company.com"
              />
              {editUserErrors.email && <p className="text-xs text-red-500 mt-1">{editUserErrors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Role <span className="text-red-400">*</span></label>
                <select
                  value={editUserForm.role}
                  onChange={e => setEditUserForm(p => ({ ...p, role: e.target.value as Role }))}
                  disabled={editUserForm.role === 'Business Owner'}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {editUserForm.role === 'Business Owner' && (
                  <p className="text-[11px] text-slate-400 mt-1">Administrator role is permanent</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Department <span className="text-red-400">*</span></label>
                <select
                  value={editUserForm.department}
                  onChange={e => setEditUserForm(p => ({ ...p, department: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">New Password (optional)</label>
              <input
                type="password"
                value={editUserForm.password}
                onChange={e => setEditUserForm(p => ({ ...p, password: e.target.value }))}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-colors ${editUserErrors.password ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`}
                placeholder="Leave blank to keep existing password"
              />
              {editUserErrors.password && <p className="text-xs text-red-500 mt-1">{editUserErrors.password}</p>}
            </div>

            {editUserApiError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                ⚠️ {editUserApiError}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
