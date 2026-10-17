import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus, Search, Filter, Download, ChevronRight, CheckCircle2,
  Users, Upload, FileSpreadsheet, Edit, Trash2, AlertCircle,
  FileText, Check, HelpCircle, X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApp } from '../context/AppContext';
import KPICard from '../components/ui/KPICard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import AccessDenied from './AccessDenied';
import { formatCurrency, type Customer } from '../data/mockData';

const CUSTOMER_TYPES = ['All', 'Retailer', 'Wholesaler', 'Distributor', 'Business', 'Enterprise'] as const;
const STATUSES = ['All', 'Active', 'Inactive', 'At Risk'] as const;

export default function Customers() {
  const {
    hasModule, hasPermission, customers, addCustomer, addCustomersBulk,
    updateCustomer, deleteCustomer, authMode, currentUser, availableUsers
  } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Add Modal State
  const [addOpen, setAddOpen] = useState(false);
  const [activeAddTab, setActiveAddTab] = useState<'manual' | 'excel'>('manual');
  const [toastMessage, setToastMessage] = useState('');

  // Excel Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [parsedCustomers, setParsedCustomers] = useState<Partial<Customer>[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Delete Confirmation State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // Add Customer Manual Form
  const getInitialFormData = () => authMode === 'real' ? {
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    taxId: '',
    industry: '',
    customerType: 'Retailer' as Customer['customerType'],
    accountOwner: currentUser?.name || 'Administrator',
    address: '',
  } : {
    businessName: 'Spencer’s Retail Supermarkets Ltd.',
    contactPerson: 'Karan Mehra',
    email: 'procurement@spencersretail.com',
    phone: '+91 33 2287 4000',
    location: 'Kolkata, West Bengal',
    website: 'https://www.spencersretail.com',
    taxId: '19AAACS1234F1Z3',
    industry: 'Modern Trade Grocery & FMCG',
    customerType: 'Enterprise' as Customer['customerType'],
    accountOwner: 'Rahul Sharma',
    address: 'Spencer’s House, 34 Chowringhee Road, Kolkata 700071',
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const handleOpenAdd = () => {
    setFormData(getInitialFormData());
    setActiveAddTab('manual');
    setSelectedFileName('');
    setParsedCustomers([]);
    setParseErrors([]);
    setAddOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  if (!hasModule('customers')) return <AccessDenied />;

  const filtered = customers.filter(c => {
    const matchSearch =
      !search ||
      c.businessName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || c.customerType === typeFilter;
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalRevenue = customers.reduce((s, c) => s + (c.totalRevenue || 0), 0);
  const activeCount = customers.filter(c => c.status === 'Active').length;
  const totalOutstanding = customers.reduce((s, c) => s + (c.outstanding || 0), 0);

  // ── Manual Add Customer ──────────────────────────────────────────────────
  const handleAddCustomerManual = async () => {
    if (!formData.businessName.trim() || !formData.email.trim()) {
      alert('Business name and email address are required.');
      return;
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now().toString().slice(-6)}`,
      businessName: formData.businessName.trim(),
      customerType: formData.customerType,
      contactPerson: formData.contactPerson.trim() || 'Procurement Executive',
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      industry: formData.industry.trim(),
      accountOwner: formData.accountOwner,
      status: 'Active',
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      outstanding: 0,
      lastPurchase: new Date().toISOString().split('T')[0],
      customerSince: new Date().toISOString().split('T')[0],
      taxId: formData.taxId.trim(),
      website: formData.website.trim(),
      address: formData.address.trim(),
      notes: 'Customer account onboarded manually.',
    };

    await addCustomer(newCustomer);
    setAddOpen(false);
    showToast(`Customer account "${newCustomer.businessName}" created successfully${authMode === 'real' ? ' and saved to database' : ''}.`);
  };

  // ── Download Excel Template ──────────────────────────────────────────────
  const handleDownloadSampleTemplate = () => {
    const sampleData = [
      {
        'Business Name': 'Reliance Retail Hypermarkets Ltd.',
        'Contact Person': 'Pooja Verma',
        'Email': 'procurement@relianceretail.com',
        'Phone': '+91 98201 12345',
        'Customer Type': 'Enterprise',
        'Location': 'Mumbai, Maharashtra',
        'Industry': 'Modern Trade Retail',
        'Tax ID': '27AAACR1234F1Z5',
        'Website': 'https://relianceretail.com',
        'Address': 'Reliance Corporate Park, Navi Mumbai 400701',
        'Account Owner': currentUser?.name || 'Administrator',
      },
      {
        'Business Name': 'Metro Cash & Carry Wholesale',
        'Contact Person': 'Amit Kapoor',
        'Email': 'orders@metrocash.in',
        'Phone': '+91 80 4111 2233',
        'Customer Type': 'Wholesaler',
        'Location': 'Bengaluru, Karnataka',
        'Industry': 'B2B Cash & Carry Distribution',
        'Tax ID': '29AAACM5678K1Z2',
        'Website': 'https://metro.co.in',
        'Address': '26/3 Industrial Suburb, Yeshwanthpur, Bengaluru 560022',
        'Account Owner': currentUser?.name || 'Administrator',
      },
      {
        'Business Name': 'Blinkit Depot Operations Pvt Ltd',
        'Contact Person': 'Rohit Sen',
        'Email': 'vendor@blinkit.com',
        'Phone': '+91 11 4055 8899',
        'Customer Type': 'Distributor',
        'Location': 'Gurugram, Haryana',
        'Industry': 'Quick Commerce Warehousing',
        'Tax ID': '07AABCB9876Q1Z4',
        'Website': 'https://blinkit.com',
        'Address': 'Sector 18 Cyber Park, Gurugram 122002',
        'Account Owner': currentUser?.name || 'Administrator',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, 'BizNexus_Customer_Import_Template.xlsx');
  };

  // ── Handle Excel / CSV File Upload & Extraction ──────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setParseErrors([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (jsonRows.length === 0) {
          setParseErrors(['The uploaded file is empty or contains no readable data rows.']);
          setParsedCustomers([]);
          return;
        }

        const extracted: Partial<Customer>[] = [];
        const errors: string[] = [];

        jsonRows.forEach((row, index) => {
          // Flexible key lookup
          const findVal = (...keys: string[]) => {
            for (const k of keys) {
              for (const rowKey of Object.keys(row)) {
                if (rowKey.trim().toLowerCase() === k.toLowerCase()) {
                  const val = row[rowKey];
                  return val !== undefined && val !== null ? String(val).trim() : '';
                }
              }
            }
            return '';
          };

          const businessName = findVal('business name', 'business_name', 'businessname', 'company name', 'company', 'client name', 'customer name', 'name');
          const email = findVal('email', 'email address', 'contact email', 'mail');
          const contactPerson = findVal('contact person', 'contact_person', 'contact name', 'contact', 'person');
          const phone = findVal('phone', 'phone number', 'mobile', 'contact number', 'tel');
          const rawType = findVal('customer type', 'customer_type', 'type', 'category', 'segment');
          const location = findVal('location', 'city', 'city, state', 'state', 'region');
          const industry = findVal('industry', 'industry segment', 'sector', 'business segment');
          const taxId = findVal('tax id', 'tax_id', 'gstin', 'gst', 'tax no', 'tin');
          const website = findVal('website', 'web', 'url', 'site');
          const address = findVal('address', 'registered address', 'office address', 'delivery address');
          const accountOwner = findVal('account owner', 'sales owner', 'salesperson', 'executive') || (currentUser?.name || 'Administrator');

          if (!businessName) {
            errors.push(`Row ${index + 2}: Missing Business Name.`);
            return;
          }

          let customerType: Customer['customerType'] = 'Retailer';
          const typeLower = rawType.toLowerCase();
          if (typeLower.includes('whole')) customerType = 'Wholesaler';
          else if (typeLower.includes('distrib')) customerType = 'Distributor';
          else if (typeLower.includes('enterp')) customerType = 'Enterprise';
          else if (typeLower.includes('busin')) customerType = 'Business';

          extracted.push({
            id: `cust-${Date.now().toString().slice(-4)}-${index + 1}`,
            businessName,
            email: email || `contact@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}.com`,
            contactPerson: contactPerson || 'Authorized Representative',
            phone: phone || '',
            location: location || 'India',
            industry: industry || 'FMCG & Commercial Retail',
            customerType,
            accountOwner,
            status: 'Active',
            totalOrders: 0,
            totalRevenue: 0,
            avgOrderValue: 0,
            outstanding: 0,
            lastPurchase: new Date().toISOString().split('T')[0],
            customerSince: new Date().toISOString().split('T')[0],
            taxId: taxId || '',
            website: website || '',
            address: address || '',
            notes: 'Imported via Excel spreadsheet upload batch.',
          });
        });

        if (extracted.length === 0 && errors.length > 0) {
          setParseErrors(errors);
        } else {
          setParsedCustomers(extracted);
          setParseErrors(errors);
        }
      } catch (err: any) {
        setParseErrors([`Failed to parse file: ${err.message || 'Unknown error'}`]);
        setParsedCustomers([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ── Import Parsed Excel Customers ────────────────────────────────────────
  const handleConfirmExcelImport = async () => {
    if (parsedCustomers.length === 0) return;
    setIsImporting(true);
    try {
      await addCustomersBulk(parsedCustomers as Customer[]);
      setAddOpen(false);
      showToast(`Successfully imported ${parsedCustomers.length} customers${authMode === 'real' ? ' and saved to database' : ''}.`);
      setParsedCustomers([]);
      setSelectedFileName('');
    } catch (err: any) {
      alert(`Import error: ${err.message || 'Failed to save customers'}`);
    } finally {
      setIsImporting(false);
    }
  };

  // ── Edit Customer Modal ──────────────────────────────────────────────────
  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer({ ...customer });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCustomer || !editingCustomer.businessName.trim() || !editingCustomer.email.trim()) {
      alert('Business name and email address are required.');
      return;
    }

    try {
      await updateCustomer(editingCustomer);
      setEditModalOpen(false);
      showToast(`Customer "${editingCustomer.businessName}" updated successfully${authMode === 'real' ? ' in database' : ''}.`);
      setEditingCustomer(null);
    } catch (err: any) {
      alert(`Failed to update customer: ${err.message || 'Error occurred'}`);
    }
  };

  // ── Delete Customer Modal ────────────────────────────────────────────────
  const handleOpenDelete = (customer: Customer) => {
    setDeletingCustomer(customer);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    try {
      await deleteCustomer(deletingCustomer.id);
      setDeleteConfirmOpen(false);
      showToast(`Customer account "${deletingCustomer.businessName}" deleted${authMode === 'real' ? ' from database' : ''}.`);
      setDeletingCustomer(null);
    } catch (err: any) {
      alert(`Failed to delete customer: ${err.message || 'Error occurred'}`);
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-2xl animate-fade-in border border-emerald-700">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">B2B Customers</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
              {customers.length} Accounts
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            Manage modern trade supermarket accounts, wholesale distributors, and quick-commerce depots.
          </p>
        </div>
        <div className="flex gap-2">
          {hasPermission('customers', 'export') && (
            <button
              onClick={() => {
                if (filtered.length === 0) {
                  alert('No customer records to export.');
                  return;
                }
                const ws = XLSX.utils.json_to_sheet(filtered.map(c => ({
                  'Customer ID': c.id,
                  'Business Name': c.businessName,
                  'Type': c.customerType,
                  'Contact Person': c.contactPerson,
                  'Email': c.email,
                  'Phone': c.phone,
                  'Location': c.location,
                  'Industry': c.industry,
                  'Account Owner': c.accountOwner,
                  'Status': c.status,
                  'Total Orders': c.totalOrders,
                  'Revenue (INR)': c.totalRevenue,
                  'Outstanding (INR)': c.outstanding,
                  'GSTIN': c.taxId,
                })));
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Customers');
                XLSX.writeFile(wb, `BizNexus_Customers_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer font-medium"
            >
              <Download size={14} /> Export Excel
            </button>
          )}
          {hasPermission('customers', 'create') && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
              style={{ background: '#2563eb' }}
            >
              <Plus size={15} /> Add Customer
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Accounts" value={`${customers.length}`} accent="#2563eb" />
        <KPICard title="Active Retail Partners" value={`${activeCount}`} accent="#16a34a" />
        <KPICard title="Lifetime Revenue" value={formatCurrency(totalRevenue)} accent="#2563eb" />
        <KPICard title="Outstanding Receivables" value={formatCurrency(totalOutstanding)} accent="#dc2626" />
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search accounts by name or contact..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none cursor-pointer"
        >
          {CUSTOMER_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none cursor-pointer"
        >
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {customers.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Customer Accounts</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Your registered company currently has no clients on file. Add manually or upload an Excel spreadsheet to bulk onboard.
            </p>
            {hasPermission('customers', 'create') && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm hover:opacity-90 cursor-pointer"
                style={{ background: '#2563eb' }}
              >
                <Plus size={14} /> Add First Customer
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Business Name', 'Type', 'Primary Contact', 'Location', 'Total Orders', 'Revenue', 'Outstanding', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400 text-xs">
                      No customer accounts matching your search filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map(c => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div
                          onClick={() => navigate(`/crm/customers/${c.id}`)}
                          className="font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          {c.businessName}
                        </div>
                        <div className="text-xs text-slate-400">{c.industry || 'B2B Trade'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {c.customerType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-700">{c.contactPerson}</div>
                        <div className="text-xs text-slate-400">{c.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{c.location || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{c.totalOrders || 0} orders</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(c.totalRevenue || 0)}</td>
                      <td className="px-4 py-3">
                        <span className={(c.outstanding || 0) > 0 ? 'text-red-600 font-medium' : 'text-slate-400'}>
                          {formatCurrency(c.outstanding || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} dot /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Customer Details"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Customer"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/crm/customers/${c.id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="View Profile Details"
                          >
                            <ChevronRight size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Customer Modal (Manual Entry + Excel Upload) ── */}
      {addOpen && (
        <Modal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          title="Onboard Customer Accounts"
          subtitle="Add individual accounts or upload an Excel / CSV spreadsheet in bulk"
          size="lg"
        >
          <div className="space-y-4">
            {/* Tab Switcher */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveAddTab('manual')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeAddTab === 'manual'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText size={14} />
                Manual Entry
              </button>
              <button
                type="button"
                onClick={() => setActiveAddTab('excel')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeAddTab === 'excel'
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileSpreadsheet size={14} />
                Upload Excel / CSV
              </button>
            </div>

            {/* TAB 1: MANUAL ENTRY */}
            {activeAddTab === 'manual' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Business Name *</label>
                    <input
                      value={formData.businessName}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Reliance Retail Hypermarket Network"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Contact Person *</label>
                    <input
                      value={formData.contactPerson}
                      onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Full contact name"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="procurement@retailer.com"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number</label>
                    <input
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 12345"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">City & State</label>
                    <input
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Industry Segment</label>
                    <input
                      value={formData.industry}
                      onChange={e => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g. Modern Trade Hypermarket"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Customer Type</label>
                    <select
                      value={formData.customerType}
                      onChange={e => setFormData({ ...formData, customerType: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    >
                      {['Retailer', 'Wholesaler', 'Distributor', 'Business', 'Enterprise'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Account Owner</label>
                    {authMode === 'real' ? (
                      availableUsers && availableUsers.length > 0 ? (
                        <select
                          value={formData.accountOwner}
                          onChange={e => setFormData({ ...formData, accountOwner: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                        >
                          {availableUsers.map(u => (
                            <option key={u.id} value={u.name}>
                              {u.name} ({u.role})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={formData.accountOwner}
                          onChange={e => setFormData({ ...formData, accountOwner: e.target.value })}
                          placeholder="Sales representative name"
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                        />
                      )
                    ) : (
                      <select
                        value={formData.accountOwner}
                        onChange={e => setFormData({ ...formData, accountOwner: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                      >
                        {['Rahul Sharma', 'Priya Shah', 'Vikramaditya Singh'].map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">GSTIN / Corporate Tax ID</label>
                    <input
                      value={formData.taxId}
                      onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="e.g. 27AAACR1234F1Z5"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono bg-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Delivery Center / Corporate Office Address</label>
                    <input
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Depot address, city, state and PIN..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAddOpen(false)}
                    className="px-4 py-2 text-xs border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomerManual}
                    className="px-5 py-2 text-xs text-white rounded-xl font-bold shadow-md hover:bg-blue-700 cursor-pointer"
                    style={{ background: '#2563eb' }}
                  >
                    Create Customer Account
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: EXCEL / CSV UPLOAD */}
            {activeAddTab === 'excel' && (
              <div className="space-y-4">
                {/* Column Instruction Card */}
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                      <HelpCircle size={16} className="text-blue-600" />
                      Excel File Column Structure & Instructions
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadSampleTemplate}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[11px] shadow-sm cursor-pointer shrink-0 transition-colors"
                    >
                      <Download size={13} />
                      Download Sample Template (.xlsx)
                    </button>
                  </div>

                  <p className="text-slate-600 text-xs">
                    Your spreadsheet file (.xlsx, .xls, or .csv) should include a header row with the following column headers. The system extracts each row and registers complete accounts directly into the database:
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-lg border border-blue-100">
                    <div>
                      <span className="font-bold text-blue-900">Required Columns:</span>
                      <ul className="list-disc pl-4 text-slate-700 mt-1 space-y-0.5">
                        <li><span className="font-semibold text-slate-900">Business Name</span> (e.g. Reliance Retail Hypermarket)</li>
                        <li><span className="font-semibold text-slate-900">Email</span> (e.g. procurement@reliance.com)</li>
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Recommended Optional Columns:</span>
                      <ul className="list-disc pl-4 text-slate-600 mt-1 space-y-0.5">
                        <li><span className="font-medium text-slate-800">Contact Person</span> (Authorized contact)</li>
                        <li><span className="font-medium text-slate-800">Phone</span> (Mobile / landline)</li>
                        <li><span className="font-medium text-slate-800">Customer Type</span> (Retailer, Wholesaler, Distributor, Enterprise)</li>
                        <li><span className="font-medium text-slate-800">Location</span> (City, State)</li>
                        <li><span className="font-medium text-slate-800">Tax ID / GSTIN</span> & <span className="font-medium text-slate-800">Address</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/20"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <FileSpreadsheet size={36} className="mx-auto text-blue-600 mb-2" />
                  <div className="font-bold text-slate-800 text-xs">
                    {selectedFileName ? selectedFileName : 'Click to select or drag and drop your Excel / CSV file'}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv)
                  </p>
                </div>

                {/* Errors Display */}
                {parseErrors.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertCircle size={14} /> Validation Warnings:
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {parseErrors.slice(0, 5).map((e, idx) => <li key={idx}>{e}</li>)}
                    </ul>
                  </div>
                )}

                {/* Extracted Rows Preview */}
                {parsedCustomers.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        Extracted Customers Preview ({parsedCustomers.length} accounts found):
                      </span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                        ✓ Ready to import
                      </span>
                    </div>

                    <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-[11px]">
                        <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 text-slate-700">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold">Business Name</th>
                            <th className="px-3 py-2 text-left font-semibold">Contact</th>
                            <th className="px-3 py-2 text-left font-semibold">Email</th>
                            <th className="px-3 py-2 text-left font-semibold">Phone</th>
                            <th className="px-3 py-2 text-left font-semibold">Type</th>
                            <th className="px-3 py-2 text-left font-semibold">Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {parsedCustomers.map((c, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-3 py-2 font-semibold text-slate-800">{c.businessName}</td>
                              <td className="px-3 py-2 text-slate-600">{c.contactPerson}</td>
                              <td className="px-3 py-2 text-slate-600">{c.email}</td>
                              <td className="px-3 py-2 text-slate-500">{c.phone || '—'}</td>
                              <td className="px-3 py-2">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                                  {c.customerType}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-slate-500">{c.location || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAddOpen(false)}
                    className="px-4 py-2 text-xs border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={parsedCustomers.length === 0 || isImporting}
                    onClick={handleConfirmExcelImport}
                    className={`px-5 py-2 text-xs rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5 ${
                      parsedCustomers.length > 0 && !isImporting
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Upload size={14} />
                    {isImporting
                      ? 'Saving to Database...'
                      : `Import & Save ${parsedCustomers.length} Customers`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Edit Customer Modal ── */}
      {editModalOpen && editingCustomer && (
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Customer Account: ${editingCustomer.businessName}`}
          subtitle="Modify client credentials, billing parameters, and assigned account owner"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Business Name *</label>
                <input
                  value={editingCustomer.businessName}
                  onChange={e => setEditingCustomer({ ...editingCustomer, businessName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Contact Person *</label>
                <input
                  value={editingCustomer.contactPerson}
                  onChange={e => setEditingCustomer({ ...editingCustomer, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={editingCustomer.email}
                  onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone Number</label>
                <input
                  value={editingCustomer.phone}
                  onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">City & State (Location)</label>
                <input
                  value={editingCustomer.location}
                  onChange={e => setEditingCustomer({ ...editingCustomer, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Industry Segment</label>
                <input
                  value={editingCustomer.industry}
                  onChange={e => setEditingCustomer({ ...editingCustomer, industry: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Customer Type</label>
                <select
                  value={editingCustomer.customerType}
                  onChange={e => setEditingCustomer({ ...editingCustomer, customerType: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  {['Retailer', 'Wholesaler', 'Distributor', 'Business', 'Enterprise'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Account Status</label>
                <select
                  value={editingCustomer.status}
                  onChange={e => setEditingCustomer({ ...editingCustomer, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="At Risk">At Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Account Owner</label>
                {authMode === 'real' ? (
                  availableUsers && availableUsers.length > 0 ? (
                    <select
                      value={editingCustomer.accountOwner}
                      onChange={e => setEditingCustomer({ ...editingCustomer, accountOwner: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    >
                      {availableUsers.map(u => (
                        <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={editingCustomer.accountOwner}
                      onChange={e => setEditingCustomer({ ...editingCustomer, accountOwner: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    />
                  )
                ) : (
                  <select
                    value={editingCustomer.accountOwner}
                    onChange={e => setEditingCustomer({ ...editingCustomer, accountOwner: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {['Rahul Sharma', 'Priya Shah', 'Vikramaditya Singh'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">GSTIN / Corporate Tax ID</label>
                <input
                  value={editingCustomer.taxId || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, taxId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono bg-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Website</label>
                <input
                  value={editingCustomer.website || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, website: e.target.value })}
                  placeholder="https://clientdomain.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Delivery Center / Corporate Office Address</label>
                <input
                  value={editingCustomer.address || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  placeholder="Depot address, city, state and PIN..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-xs border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 text-xs text-white rounded-xl font-bold shadow-md hover:bg-blue-700 cursor-pointer"
                style={{ background: '#2563eb' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Customer Confirmation Modal ── */}
      {deleteConfirmOpen && deletingCustomer && (
        <Modal
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          title="Delete Customer Account"
          subtitle={`Are you sure you want to delete ${deletingCustomer.businessName}?`}
          size="sm"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Permanent Deletion: </span>
                This action will delete <span className="font-bold">{deletingCustomer.businessName}</span>
                {authMode === 'real' ? ' from the database' : ''}. Sales orders and quotations linked to this account will retain their transaction records.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 text-xs border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
