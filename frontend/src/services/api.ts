/**
 * BizNexus API Service — connects to the FastAPI backend
 * All auth operations (register, login, add-user, permissions) go through here.
 * The frontend keeps demo data in memory for demo mode; real company data
 * is fetched from / persisted to the SQLite backend.
 */

const API_BASE = '/api'; // proxied by Vite to localhost:8000

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.detail || `Request failed: ${res.status}`);
  }
  return data as T;
}

// ─── Register ─────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  owner_designation: string;
  password: string;
  company_name: string;
  trading_name?: string;
  industry: string;
  company_size?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  selected_modules: string[];
  enabled_roles: string[];
}

export interface ApiUser {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  is_owner: boolean;
  company_id: string;
}

export interface ApiCompany {
  id: string;
  name: string;
  trading_name: string;
  industry: string;
  company_size: string;
  website: string;
  city: string;
  state: string;
  country: string;
  owner_name: string;
  owner_designation: string;
  selected_modules: string[];
  enabled_roles: string[];
  tenant_id: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  user: ApiUser;
  company: ApiCompany;
}

export async function apiRegister(payload: RegisterPayload): Promise<AuthResponse & { company_id: string; user_id: string }> {
  return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export async function apiCheckEmail(email: string): Promise<{ email: string; exists: boolean; available: boolean }> {
  return apiFetch(`/auth/check-email?email=${encodeURIComponent(email)}`);
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ─── Add User ─────────────────────────────────────────────────────────────────

export interface AddUserPayload {
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  department: string;
}

export async function apiAddUser(payload: AddUserPayload): Promise<{ success: boolean; user: ApiUser }> {
  return apiFetch('/auth/add-user', { method: 'POST', body: JSON.stringify(payload) });
}

// ─── Company Users ────────────────────────────────────────────────────────────

export async function apiGetCompanyUsers(companyId: string): Promise<ApiUser[]> {
  return apiFetch(`/auth/company/${companyId}/users`);
}

// ─── Permissions ──────────────────────────────────────────────────────────────

export interface PermRow {
  company_id: string;
  role?: string;
  user_id?: string;
  module: string;
  perm_view: number;
  perm_create: number;
  perm_edit: number;
  perm_delete: number;
  perm_export: number;
  perm_approve: number;
}

export async function apiSaveRolePermission(p: {
  company_id: string; role: string; module: string;
  view: boolean; create: boolean; edit: boolean;
  delete: boolean; export: boolean; approve: boolean;
}): Promise<{ success: boolean }> {
  return apiFetch('/auth/permissions/role', { method: 'POST', body: JSON.stringify(p) });
}

export async function apiSaveBulkRolePermissions(p: {
  company_id: string;
  permissions: Array<{
    company_id: string;
    role: string;
    module: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
    approve: boolean;
  }>;
}): Promise<{ success: boolean; saved: number }> {
  return apiFetch('/auth/permissions/role/bulk', { method: 'POST', body: JSON.stringify(p) });
}

export async function apiSaveUserPermission(p: {
  company_id: string; user_id: string; module: string;
  view: boolean; create: boolean; edit: boolean;
  delete: boolean; export: boolean; approve: boolean;
}): Promise<{ success: boolean }> {
  return apiFetch('/auth/permissions/user', { method: 'POST', body: JSON.stringify(p) });
}

export async function apiGetPermissions(companyId: string): Promise<PermRow[]> {
  return apiFetch(`/auth/permissions/${companyId}`);
}

export interface UpdateUserPayload {
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department: string;
  password?: string;
}

export async function apiUpdateUser(userId: string, payload: UpdateUserPayload): Promise<{ success: boolean; user: ApiUser }> {
  return apiFetch(`/auth/users/${userId}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function apiDeleteUser(userId: string, companyId: string): Promise<{ success: boolean }> {
  return apiFetch(`/auth/users/${userId}?company_id=${encodeURIComponent(companyId)}`, { method: 'DELETE' });
}

export async function apiSaveBulkUserPermissions(p: {
  company_id: string;
  overrides: Array<{
    company_id: string;
    user_id: string;
    module: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
    approve: boolean;
  }>;
}): Promise<{ success: boolean; saved: number }> {
  return apiFetch('/auth/permissions/user/bulk', { method: 'POST', body: JSON.stringify(p) });
}

// ─── Customer API ─────────────────────────────────────────────────────────────

export async function apiGetCustomers(companyId: string): Promise<any[]> {
  return apiFetch(`/auth/company/${encodeURIComponent(companyId)}/customers`);
}

export async function apiAddCustomer(companyId: string, customer: any): Promise<{ success: boolean; customer: any }> {
  return apiFetch(`/auth/company/${encodeURIComponent(companyId)}/customers`, {
    method: 'POST',
    body: JSON.stringify(customer),
  });
}

export async function apiBulkAddCustomers(companyId: string, customers: any[]): Promise<{ success: boolean; customers: any[]; count: number }> {
  return apiFetch(`/auth/company/${encodeURIComponent(companyId)}/customers/bulk`, {
    method: 'POST',
    body: JSON.stringify({ customers }),
  });
}

export async function apiUpdateCustomer(companyId: string, customerId: string, customer: any): Promise<{ success: boolean; customer: any }> {
  return apiFetch(`/auth/company/${encodeURIComponent(companyId)}/customers/${encodeURIComponent(customerId)}`, {
    method: 'PUT',
    body: JSON.stringify(customer),
  });
}

export async function apiDeleteCustomer(companyId: string, customerId: string): Promise<{ success: boolean; message: string }> {
  return apiFetch(`/auth/company/${encodeURIComponent(companyId)}/customers/${encodeURIComponent(customerId)}`, {
    method: 'DELETE',
  });
}


