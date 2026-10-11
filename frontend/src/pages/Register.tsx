import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Upload,
  Globe,
  Mail,
  Phone,
  FileCheck,
  Check,
  Sparkles,
  Layers3,
  Users,
  Compass,
  Cpu,
  BadgeAlert,
  HelpCircle,
} from 'lucide-react';
import { useApp, type CompanyProfile, type Role } from '../context/AppContext';

interface RoleOption {
  role: Role;
  title: string;
  department: string;
  desc: string;
  badge: string;
  recommended: boolean;
}

const AVAILABLE_PORTAL_ROLES: RoleOption[] = [
  {
    role: 'Business Owner',
    title: 'Managing Director / Owner',
    department: 'Executive Governance',
    desc: 'Unrestricted omni-access across financial ledgers, margins, and operational modules.',
    badge: 'Mandatory',
    recommended: true,
  },
  {
    role: 'Sales Manager',
    title: 'Commercial & Sales Lead',
    department: 'Commercial Operations',
    desc: 'Pipeline governance, quotation thresholds, team targets, and customer contracts.',
    badge: 'Recommended',
    recommended: true,
  },
  {
    role: 'Sales Executive',
    title: 'Client Acquisition Executive',
    department: 'Direct Sales',
    desc: 'Lead capture, follow-up timelines, customer quotes, and deal execution.',
    badge: 'Standard',
    recommended: true,
  },
  {
    role: 'Marketing Manager',
    title: 'Growth & Campaigns Lead',
    department: 'Marketing Hub',
    desc: 'Social broadcast campaigns, inbound enquiry tracking, and attribution metrics.',
    badge: 'Growth Tier',
    recommended: false,
  },
  {
    role: 'Inventory Manager',
    title: 'Supply Chain & Stock Lead',
    department: 'Warehouse & Logistics',
    desc: 'Multi-warehouse stock levels, SKU catalogues, reorder alerts, and safety thresholds.',
    badge: 'Logistics',
    recommended: true,
  },
  {
    role: 'Purchase Manager',
    title: 'Procurement Specialist',
    department: 'Vendor Relations',
    desc: 'Vendor directories, PO requisitions, receiving checklists, and supplier ratings.',
    badge: 'Logistics',
    recommended: false,
  },
  {
    role: 'Finance Manager',
    title: 'Financial Controller',
    department: 'Treasury & Accounts',
    desc: 'Invoicing lifecycle, accounts receivable/payable, payments, and expenses.',
    badge: 'Essential',
    recommended: true,
  },
  {
    role: 'Business Analyst',
    title: 'Enterprise Strategy Analyst',
    department: 'Analytics & BI',
    desc: 'Read-only business intelligence, trend synthesis, and corporate reports.',
    badge: 'Analytics',
    recommended: false,
  },
];

const MODULE_OPTIONS = [
  { id: 'leads', name: 'CRM & Pipeline', category: 'Commercial', desc: 'Lead tracking & stages' },
  { id: 'customers', name: 'Customer Directory', category: 'Commercial', desc: 'B2B Accounts 360°' },
  { id: 'sales-orders', name: 'Sales Orders', category: 'Commercial', desc: 'Order fulfillment' },
  { id: 'quotations', name: 'Quotations', category: 'Commercial', desc: 'Contract proposals' },
  { id: 'inventory', name: 'Inventory & SKUs', category: 'Operations', desc: 'Stock & warehouses' },
  { id: 'purchases', name: 'Procurement', category: 'Operations', desc: 'Purchase orders' },
  { id: 'suppliers', name: 'Suppliers', category: 'Operations', desc: 'Vendor management' },
  { id: 'finance', name: 'Finance & Invoices', category: 'Financial', desc: 'Billing & ledgers' },
  { id: 'social-content', name: 'Marketing Hub', category: 'Growth', desc: 'Campaign tracking' },
  { id: 'analytics', name: 'Analytics & BI', category: 'Intelligence', desc: 'Executive charts' },
  { id: 'documents', name: 'Document Vault (RAG)', category: 'Intelligence', desc: 'Knowledge base' },
  { id: 'ai-assistant', name: 'BizNexus Decision AI', category: 'Intelligence', desc: 'Context assistant' },
];

export default function Register() {
  const navigate = useNavigate();
  const { registerCompany } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadMockStatus, setUploadMockStatus] = useState<string>('GST_Certificate_2024.pdf');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Owner Details
    ownerName: 'Vikramaditya Singhania',
    ownerEmail: 'vikramaditya@singhaniagroup.in',
    ownerPhone: '+91 98201 44890',
    ownerDesignation: 'Chairman & Managing Director',
    password: 'Password@2026',
    confirmPassword: 'Password@2026',
    // Step 2: Business Details
    companyName: 'Singhania Industrial Holdings Pvt. Ltd.',
    tradingName: 'Singhania Logistics & Distribution',
    industry: 'Distribution & Supply Chain Logistics',
    companySize: '51-200 employees',
    website: 'https://singhaniagroup.in',
    registeredAddress: 'Apex Commercial Plaza, Senapati Bapat Marg, Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400013',
    // Step 3: Authenticity & Proofs
    gstin: 'GSTIN27AABCS9876K1ZX',
    panNumber: 'AABCS9876K',
    cinNumber: 'U51909MH2021PTC368921',
    incorporationDate: '2021-08-14',
    complianceCert: 'ISO 9001:2015 & GST Registered Enterprise',
    complianceCheck: true,
    // Step 4: Roles & Modules
    enabledRoles: [
      'Business Owner',
      'Sales Manager',
      'Sales Executive',
      'Inventory Manager',
      'Finance Manager',
    ] as Role[],
    selectedModules: [
      'dashboard',
      'leads',
      'customers',
      'sales-orders',
      'quotations',
      'inventory',
      'purchases',
      'suppliers',
      'finance',
      'invoices',
      'payments',
      'expenses',
      'analytics',
      'documents',
      'ai-assistant',
      'users-roles',
      'settings',
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!formData.ownerName.trim()) errs.ownerName = 'Owner full name is required';
      if (!formData.ownerEmail.trim()) errs.ownerEmail = 'Business email is required';
      if (!formData.ownerPhone.trim()) errs.ownerPhone = 'Phone number is required';
      if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    } else if (step === 2) {
      if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
      if (!formData.industry) errs.industry = 'Please select an industry';
      if (!formData.registeredAddress.trim()) errs.registeredAddress = 'Address is required';
      if (!formData.city.trim()) errs.city = 'City is required';
      if (!formData.pincode.trim()) errs.pincode = 'Pincode is required';
    } else if (step === 3) {
      if (!formData.gstin.trim() || formData.gstin.length < 10) errs.gstin = 'Valid GSTIN number is required';
      if (!formData.panNumber.trim() || formData.panNumber.length < 10) errs.panNumber = 'Valid corporate PAN is required';
      if (!formData.complianceCheck) errs.complianceCheck = 'Please verify organization authenticity';
    } else if (step === 4) {
      if (formData.enabledRoles.length === 0) errs.enabledRoles = 'Select at least one role for your portal';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as any);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as any);
  };

  const toggleRole = (role: Role) => {
    if (role === 'Business Owner') return; // Owner always included
    setFormData((prev) => {
      const exists = prev.enabledRoles.includes(role);
      const updated = exists
        ? prev.enabledRoles.filter((r) => r !== role)
        : [...prev.enabledRoles, role];
      return { ...prev, enabledRoles: updated };
    });
  };

  const toggleModule = (modId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedModules.includes(modId);
      const updated = exists
        ? prev.selectedModules.filter((m) => m !== modId)
        : [...prev.selectedModules, modId];
      return { ...prev, selectedModules: updated };
    });
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    // Simulate enterprise tenant provisioning
    await new Promise((r) => setTimeout(r, 1200));

    const tenantSlug = formData.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 15);

    const profile: CompanyProfile = {
      companyName: formData.companyName,
      tradingName: formData.tradingName || formData.companyName,
      industry: formData.industry,
      companySize: formData.companySize,
      website: formData.website,
      registeredAddress: formData.registeredAddress,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pincode: formData.pincode,
      gstin: formData.gstin.toUpperCase(),
      panNumber: formData.panNumber.toUpperCase(),
      cinNumber: formData.cinNumber,
      incorporationDate: formData.incorporationDate,
      complianceCert: formData.complianceCert,
      isVerified: true,
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail,
      ownerPhone: formData.ownerPhone,
      ownerDesignation: formData.ownerDesignation || 'Managing Director',
      selectedModules: formData.selectedModules,
      enabledRoles: formData.enabledRoles,
      tenantId: `tenant-${tenantSlug || 'enterprise'}`,
      createdAt: new Date().toISOString(),
    };

    registerCompany(profile);
    setSubmitting(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#FAF7F2] text-[#1F130B]">
      {/* ── Left Hero Panel (Off-white / Warm Espresso Aesthetic) ── */}
      <div className="hidden lg:flex flex-col w-[460px] xl:w-[500px] relative overflow-hidden bg-[#120904] text-[#FAF7F2] p-10 justify-between">
        {/* Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E190E]/60 via-[#120904] to-[#1A0F08] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-lg bg-gradient-to-br from-[#78350F] via-[#D97706] to-[#EA580C] shadow-lg shadow-orange-900/30">
              B
            </div>
            <div>
              <div className="font-display font-bold text-white text-xl leading-none">BizNexus</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400 mt-1">
                Commercial OS
              </div>
            </div>
          </Link>

          <div className="mt-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/25">
              <ShieldCheck size={13} /> Tenant Isolation Architecture
            </span>
            <h1 className="font-display text-3xl xl:text-4xl font-extrabold text-white leading-tight mt-4">
              Deploy your authoritative company workspace.
            </h1>
            <p className="mt-3 text-stone-300 text-sm leading-relaxed">
              Register your business entity once. BizNexus initializes a cryptographically isolated tenant with verified compliance, automated audit records, and role-based employee portals.
            </p>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="mt-10 space-y-4">
            {[
              { num: 1, title: 'Owner Identity', desc: 'Designate company executive & credentials' },
              { num: 2, title: 'Commercial Entity', desc: 'Operating address & industry profile' },
              { num: 3, title: 'Authenticity & Tax', desc: 'GSTIN, PAN & registration proofs' },
              { num: 4, title: 'Portal Roles & Modules', desc: 'Select employee portals & permissions' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  className={`flex items-start gap-3.5 p-3 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-white/[0.08] border border-amber-400/40 shadow-sm'
                      : isPast
                      ? 'bg-white/[0.02] border border-white/5 opacity-70'
                      : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isActive
                        ? 'bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white shadow-md shadow-orange-600/30'
                        : 'bg-white/10 text-stone-400'
                    }`}
                  >
                    {isPast ? <Check size={14} /> : step.num}
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">{step.title}</div>
                    <div className="text-stone-400 text-[11px] mt-0.5">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <span>Enterprise 256-bit AES</span>
          <span className="font-mono text-amber-400/80">SOC-2 Type II Certified</span>
        </div>
      </div>

      {/* ── Right Content Form Panel ── */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 sm:p-10 lg:p-12">
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden pb-6 border-b border-[#5C3A21]/15 mb-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white bg-gradient-to-br from-[#78350F] to-[#EA580C]">
              B
            </div>
            <span className="font-bold font-display text-base text-[#1F130B]">BizNexus</span>
          </Link>
          <div className="text-xs font-semibold text-[#5C3A21]">
            Step {currentStep} of 4
          </div>
        </div>

        <div className="max-w-2xl w-full mx-auto my-auto">
          {/* Top Back / Login link */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C3A21] hover:text-[#1F130B] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Overview
            </Link>
            <div className="text-xs text-[#5C3A21]">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-[#EA580C] hover:underline">
                Sign in to workspace
              </Link>
            </div>
          </div>

          {/* Stepper Pills on Mobile/Tablet */}
          <div className="flex items-center justify-between gap-2 mb-8 lg:hidden">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step <= currentStep
                    ? 'bg-gradient-to-r from-[#D97706] to-[#EA580C]'
                    : 'bg-[#5C3A21]/15'
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleRegistrationSubmit}>
            {/* ════ STEP 1: OWNER DETAILS ════ */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
                    <User size={14} /> Step 1: Organization Owner Identity
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F130B]">
                    Who is deploying this business workspace?
                  </h2>
                  <p className="text-[#5C3A21]/80 text-sm mt-1">
                    This account will be designated as the root Managing Director / Business Owner with full governance privileges.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="e.g. Vikramaditya Singhania"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                    />
                    {errors.ownerName && <p className="text-xs text-red-600 mt-1">{errors.ownerName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Executive Designation *
                    </label>
                    <input
                      type="text"
                      value={formData.ownerDesignation}
                      onChange={(e) => setFormData({ ...formData, ownerDesignation: e.target.value })}
                      placeholder="e.g. Managing Director / Founder"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Business Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                        placeholder="owner@yourcompany.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium pr-10"
                      />
                      <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    </div>
                    {errors.ownerEmail && <p className="text-xs text-red-600 mt-1">{errors.ownerEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Direct Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.ownerPhone}
                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                        placeholder="+91 98200 12345"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium pr-10"
                      />
                      <Phone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    </div>
                    {errors.ownerPhone && <p className="text-xs text-red-600 mt-1">{errors.ownerPhone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Master Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium pr-10"
                      />
                      <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    </div>
                    {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium pr-10"
                      />
                      <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Pre-filled Notice */}
                <div className="p-3.5 rounded-xl bg-[#5C3A21]/5 border border-[#5C3A21]/15 text-xs text-[#5C3A21] flex items-center justify-between">
                  <span>💡 Preset with realistic demo corporate credentials for immediate testing.</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        ownerName: 'Vikramaditya Singhania',
                        ownerEmail: 'vikramaditya@singhaniagroup.in',
                        ownerPhone: '+91 98201 44890',
                      }))
                    }
                    className="font-bold text-[#EA580C] hover:underline text-[11px]"
                  >
                    Reset Preset
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP 2: BUSINESS DETAILS ════ */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
                    <Building2 size={14} /> Step 2: Commercial Business Entity
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F130B]">
                    Corporate Identity & Operations
                  </h2>
                  <p className="text-[#5C3A21]/80 text-sm mt-1">
                    Configure your registered legal enterprise and primary business classification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Registered Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Acme Industries Pvt. Ltd."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                    />
                    {errors.companyName && <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Brand / Operating Name
                    </label>
                    <input
                      type="text"
                      value={formData.tradingName}
                      onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                      placeholder="e.g. Acme Global Logistics"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Primary Industry *
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                    >
                      <option value="Distribution & Supply Chain Logistics">Distribution & Logistics</option>
                      <option value="Manufacturing & Heavy Industrial">Manufacturing & Industrial</option>
                      <option value="Consumer Goods & FMCG Retail">FMCG & Consumer Goods</option>
                      <option value="Technology & Enterprise SaaS">Technology & IT Services</option>
                      <option value="Pharmaceuticals & Healthcare Supply">Pharma & Healthcare</option>
                      <option value="Construction & Building Materials">Construction Materials</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Organization Scale
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                    >
                      <option value="1-15 employees">1-15 employees (Seed / Studio)</option>
                      <option value="16-50 employees">16-50 employees (Emerging Commercial)</option>
                      <option value="51-200 employees">51-200 employees (Scale Enterprise)</option>
                      <option value="200+ employees">200+ employees (Multi-Entity Conglomerate)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                    Official Website
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourcompany.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium pr-10"
                    />
                    <Globe size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                    Registered Corporate Address *
                  </label>
                  <input
                    type="text"
                    value={formData.registeredAddress}
                    onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                    placeholder="Suite / Floor / Street Address"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                  />
                  {errors.registeredAddress && <p className="text-xs text-red-600 mt-1">{errors.registeredAddress}</p>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#5C3A21]/20 bg-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#5C3A21]/20 bg-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#5C3A21]/20 bg-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      readOnly
                      className="w-full px-3 py-2 rounded-xl border border-[#5C3A21]/20 bg-stone-100 text-xs font-medium text-stone-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════ STEP 3: AUTHENTICITY & LEGAL PROOF ════ */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
                    <ShieldCheck size={14} /> Step 3: Authenticity & Statutory Credentials
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F130B]">
                    Corporate Legitimacy Verification
                  </h2>
                  <p className="text-[#5C3A21]/80 text-sm mt-1">
                    BizNexus validates commercial tax registrations and corporate identification to establish audit traceability.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      GSTIN Identification *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                        placeholder="GSTIN27AABCS9876K1ZX"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm font-mono tracking-wider focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium uppercase"
                      />
                      <FileCheck size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                    </div>
                    {errors.gstin && <p className="text-xs text-red-600 mt-1">{errors.gstin}</p>}
                    <span className="text-[11px] text-stone-500 mt-1 block">Valid 15-character Indian Goods & Services Tax ID</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Corporate PAN Number *
                    </label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                      placeholder="AABCS9876K"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm font-mono tracking-wider focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium uppercase"
                    />
                    {errors.panNumber && <p className="text-xs text-red-600 mt-1">{errors.panNumber}</p>}
                    <span className="text-[11px] text-stone-500 mt-1 block">10-character Permanent Account Number</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Corporate Identity (CIN / RoC)
                    </label>
                    <input
                      type="text"
                      value={formData.cinNumber}
                      onChange={(e) => setFormData({ ...formData, cinNumber: e.target.value.toUpperCase() })}
                      placeholder="U51909MH2021PTC368921"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm font-mono focus:outline-none focus:border-[#EA580C] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Incorporation Date
                    </label>
                    <input
                      type="date"
                      value={formData.incorporationDate}
                      onChange={(e) => setFormData({ ...formData, incorporationDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] font-medium"
                    />
                  </div>
                </div>

                {/* Upload Verification Document Box */}
                <div>
                  <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                    Statutory Registration Document (Certificate / License)
                  </label>
                  <div className="border-2 border-dashed border-[#5C3A21]/25 hover:border-[#EA580C] rounded-2xl p-5 bg-white text-center transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center mx-auto mb-2">
                      <Upload size={18} />
                    </div>
                    <div className="text-xs font-bold text-[#1F130B]">
                      {uploadMockStatus}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Attached verified digital certificate (PDF or PNG up to 10MB)
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadMockStatus('Corporate_Incorp_Certificate_Signed.pdf')}
                      className="mt-2 text-[11px] font-bold text-[#EA580C] hover:underline"
                    >
                      Replace Sample Certificate
                    </button>
                  </div>
                </div>

                {/* Authenticity Declaration Checkbox */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.complianceCheck}
                      onChange={(e) => setFormData({ ...formData, complianceCheck: e.target.checked })}
                      className="w-4 h-4 rounded text-[#EA580C] focus:ring-[#EA580C] mt-0.5 accent-[#EA580C]"
                    />
                    <div className="text-xs text-emerald-950">
                      <span className="font-bold">Affirmation of Authenticity & Enterprise Authority:</span>
                      <p className="text-emerald-900/80 mt-0.5">
                        I certify that I am the authorized representative of {formData.companyName || 'this entity'}. All tax and corporate registration details provided are authentic and lawful under applicable commercial legislation.
                      </p>
                    </div>
                  </label>
                  {errors.complianceCheck && <p className="text-xs text-red-600 mt-2">{errors.complianceCheck}</p>}
                </div>
              </div>
            )}

            {/* ════ STEP 4: SELECTION OF PORTAL ROLES & MODULES ════ */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
                    <Layers3 size={14} /> Step 4: Organization Roles & Portal Capabilities
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F130B]">
                    Configure Roles for Your Portal
                  </h2>
                  <p className="text-[#5C3A21]/80 text-sm mt-1">
                    Select which employee roles you want enabled in your company's workspace. Pre-configured staff accounts will be provisioned so you can demo and switch between them immediately.
                  </p>
                </div>

                {/* Role Selection Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C3A21]">
                      Select Active Enterprise Roles ({formData.enabledRoles.length} Selected)
                    </label>
                    <span className="text-[11px] text-stone-500">
                      Click to toggle roles on/off
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {AVAILABLE_PORTAL_ROLES.map((r) => {
                      const isSelected = formData.enabledRoles.includes(r.role);
                      const isOwner = r.role === 'Business Owner';
                      return (
                        <div
                          key={r.role}
                          onClick={() => toggleRole(r.role)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white border-[#EA580C] shadow-sm ring-1 ring-[#EA580C]/20'
                              : 'bg-white/60 border-stone-200 hover:border-stone-300 opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                  isSelected
                                    ? 'bg-[#EA580C] text-white'
                                    : 'bg-stone-200 text-stone-600'
                                }`}
                              >
                                {isSelected ? <Check size={14} /> : '+'}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-[#1F130B]">{r.role}</div>
                                <div className="text-[10px] text-stone-500">{r.department}</div>
                              </div>
                            </div>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                isOwner
                                  ? 'bg-amber-100 text-amber-800'
                                  : isSelected
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-stone-100 text-stone-500'
                              }`}
                            >
                              {r.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5C3A21]/80 mt-2 line-clamp-2 leading-tight">
                            {r.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Commercial Modules Enablement */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C3A21] block mb-2">
                    Commercial Modules Provisioned ({formData.selectedModules.length} Active)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MODULE_OPTIONS.map((m) => {
                      const isModActive = formData.selectedModules.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleModule(m.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all border ${
                            isModActive
                              ? 'bg-white border-amber-300 font-semibold text-[#1F130B] shadow-2xs'
                              : 'bg-stone-100/60 border-transparent text-stone-400'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] ${
                              isModActive ? 'bg-[#D97706] text-white' : 'bg-stone-300'
                            }`}
                          >
                            {isModActive ? '✓' : ''}
                          </div>
                          <span className="truncate">{m.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Final Confirmation Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#78350F]/10 via-[#D97706]/10 to-[#EA580C]/10 border border-[#D97706]/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white flex items-center justify-center shrink-0">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1F130B]">
                        Ready to launch {formData.companyName || 'your business'}
                      </div>
                      <div className="text-[11px] text-[#5C3A21]/80 mt-0.5">
                        Your workspace will be initialized with tenant ID <span className="font-mono font-bold text-amber-800">tenant-{formData.companyName.toLowerCase().slice(0, 10).replace(/[^a-z0-9]/g, '')}</span>. You can switch between all selected roles in the topbar or sidebar immediately.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════ NAVIGATION BUTTONS ════ */}
            <div className="mt-8 pt-6 border-t border-[#5C3A21]/15 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl border border-[#5C3A21]/20 font-bold text-xs text-[#5C3A21] hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] text-white font-bold text-xs shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  Continue to Step {currentStep + 1}
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] text-white font-bold text-sm shadow-xl shadow-orange-600/30 hover:shadow-2xl hover:shadow-orange-600/40 transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Provisioning Workspace & Roles...
                    </>
                  ) : (
                    <>
                      Complete Registration & Launch Portal
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-6 text-center text-xs text-stone-400">
          BizNexus Enterprise Portal Engine · Multi-Tenant Architecture
        </div>
      </div>
    </div>
  );
}
