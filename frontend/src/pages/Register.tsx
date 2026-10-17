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
  Globe,
  Mail,
  Phone,
  Check,
  Sparkles,
  Layers3,
  Users,
  Compass,
  Cpu,
  BadgeAlert,
  HelpCircle,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { useApp, type CompanyProfile, type Role } from '../context/AppContext';
import { apiCheckEmail } from '../services/api';

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

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Form State (Default: Food & Beverages / Nestlé FMCG)
  const [formData, setFormData] = useState({
    // Step 1: Owner Details
    ownerName: 'Suresh Narayanan',
    ownerEmail: 'suresh.narayanan@nestle.in',
    ownerPhone: '+91 98201 44890',
    ownerDesignation: 'Chairman & Managing Director',
    password: 'Password@2026',
    confirmPassword: 'Password@2026',
    // Step 2: Business Details
    companyName: 'Nestlé India Consumer Products Ltd.',
    tradingName: 'Nestlé Nutrition & Foods',
    industry: 'Food & Beverages',  // Default: Food & Beverages
    companySize: '51-200 employees',
    website: 'https://www.nestle.in',
    registeredAddress: 'Nestlé House, Jacaranda Marg, DLF City Phase II',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    pincode: '122002',
    // Roles & Modules
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
      if (!formData.ownerName.trim()) {
        errs.ownerName = 'Owner full legal name is required';
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.ownerEmail.trim()) {
        errs.ownerEmail = 'Business email is required';
      } else if (!emailRegex.test(formData.ownerEmail.trim())) {
        errs.ownerEmail = 'Invalid email address format (e.g. name@company.com)';
      }

      // Phone format validation (must be at least 10 digits)
      const cleanPhone = formData.ownerPhone.replace(/[\s\-\(\)]/g, '');
      if (!cleanPhone) {
        errs.ownerPhone = 'Phone number is required';
      } else if (!/^\+?\d{10,14}$/.test(cleanPhone)) {
        errs.ownerPhone = 'Please enter a valid phone number (at least 10 digits)';
      }

      // Password validation
      if (!formData.password) {
        errs.password = 'Master password is required';
      } else if (formData.password.length < 6) {
        errs.password = 'Password must be at least 6 characters';
      }

      // Password match validation
      if (!formData.confirmPassword) {
        errs.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
      if (!formData.industry) errs.industry = 'Please select an industry';
      if (!formData.registeredAddress.trim()) errs.registeredAddress = 'Address is required';
      if (!formData.city.trim()) errs.city = 'City is required';
      if (!formData.pincode.trim()) errs.pincode = 'Pincode is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 1) {
      try {
        setCheckingEmail(true);
        const check = await apiCheckEmail(formData.ownerEmail.trim());
        if (check.exists) {
          setErrors((prev) => ({
            ...prev,
            ownerEmail: 'This email is already registered in the system. Please sign in or use a different email.',
          }));
          return;
        }
      } catch (err) {
        console.warn('Email uniqueness check failed:', err);
      } finally {
        setCheckingEmail(false);
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 2) as any);
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

  // Standalone registration function — calls SQLite backend
  const doRegister = async () => {
    if (!validateStep(2)) return;
    setSubmitting(true);
    setRegisterError('');

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
      gstin: '',
      panNumber: '',
      cinNumber: '',
      incorporationDate: '',
      complianceCert: '',
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

    try {
      await registerCompany(profile, formData.password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
          <span>© 2026 BizNexus Platform</span>
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
            Step {currentStep} of 2
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
            {[1, 2].map((step) => (
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

          <form>
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
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                        title={showPassword ? 'Hide password' : 'View password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-600 mt-1 font-medium">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({ ...formData, confirmPassword: e.target.value });
                          if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#5C3A21]/20 bg-white text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                        title={showConfirmPassword ? 'Hide password' : 'View password'}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-600 mt-1 font-medium">{errors.confirmPassword}</p>}
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
                        ownerName: 'Suresh Narayanan',
                        ownerEmail: 'suresh.narayanan@nestle.in',
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
                      <option value="Food & Beverages">Food & Beverages</option>
                      <option value="Distribution & Supply Chain Logistics">Distribution & Logistics</option>
                      <option value="Manufacturing & Heavy Industrial">Manufacturing & Industrial</option>
                      <option value="Consumer Goods & FMCG Retail">FMCG & Consumer Goods</option>
                      <option value="Technology & Enterprise SaaS">Technology & IT Services</option>
                      <option value="Pharmaceuticals & Healthcare Supply">Pharma & Healthcare</option>
                      <option value="Construction & Building Materials">Construction Materials</option>
                      <option value="Automotive & Components">Automotive & Components</option>
                      <option value="Agriculture & Agro-Processing">Agriculture & Agro-Processing</option>
                      <option value="Textiles & Apparel">Textiles & Apparel</option>
                      <option value="Chemicals & Specialty Materials">Chemicals & Materials</option>
                      <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                      <option value="Education & EdTech">Education & EdTech</option>
                      <option value="Real Estate & Infrastructure">Real Estate & Infrastructure</option>
                      <option value="Logistics & Freight">Logistics & Freight</option>
                      <option value="Healthcare & Medical Devices">Healthcare & Medical Devices</option>
                      <option value="Media & Entertainment">Media & Entertainment</option>
                      <option value="Financial Services & Fintech">Financial Services & Fintech</option>
                      <option value="Other">Other</option>
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

                {/* Final Confirmation & Launch Banner */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#78350F]/10 via-[#D97706]/10 to-[#EA580C]/10 border border-[#D97706]/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white flex items-center justify-center shrink-0">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1F130B]">
                        Ready to launch {formData.companyName || 'your business'}
                      </div>
                      <div className="text-[11px] text-[#5C3A21]/80 mt-0.5">
                        Your workspace will be provisioned with tenant ID <span className="font-mono font-bold text-amber-800">tenant-{formData.companyName.toLowerCase().slice(0, 10).replace(/[^a-z0-9]/g, '') || 'enterprise'}</span>. Pre-configured staff accounts and modules are enabled so you can switch roles immediately.
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

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={checkingEmail}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] text-white font-bold text-xs shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {checkingEmail ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Checking Email Availability...
                    </>
                  ) : (
                    <>
                      Continue to Step {currentStep + 1}
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {registerError && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                      ⚠️ {registerError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={doRegister}
                    disabled={submitting}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] text-white font-bold text-sm shadow-xl shadow-orange-600/30 hover:shadow-2xl hover:shadow-orange-600/40 transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Provisioning Workspace & Saving to DB...
                      </>
                    ) : (
                      <>
                        Complete Registration & Launch Portal
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
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
