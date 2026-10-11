import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Cpu,
  CreditCard,
  Database,
  Eye,
  FileCheck,
  FileSearch,
  FileText,
  Fingerprint,
  FolderOpen,
  Globe,
  Layers3,
  Lock,
  Mail,
  Menu,
  Network,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Quote,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Workflow,
  X,
  Zap,
  Building2,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router';

/* ─── Intersection observer hook for section animations ────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Professional Color & Navigation Data ─────────────────────────────────── */

const navItems = [
  { id: 'hero', label: 'Overview', icon: Globe },
  { id: 'platform', label: 'Platform', icon: Layers3 },
  { id: 'workflow', label: 'Workflow', icon: Workflow },
  { id: 'roles', label: 'Governance', icon: UserCheck },
  { id: 'intelligence', label: 'Intelligence', icon: BrainCircuit },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'testimonials', label: 'Validation', icon: Star },
];

const modules = [
  { icon: Target, label: 'CRM', title: 'Commercial Relationships', desc: 'Account lifecycle, enterprise pipeline, and unified communication history.', gradient: 'from-[#B45309] to-[#D97706]' },
  { icon: ShoppingCart, label: 'Sales', title: 'Revenue & Orders', desc: 'Quotations, contract execution, order management, and multi-channel fulfillment.', gradient: 'from-[#EA580C] to-[#F59E0B]' },
  { icon: Package, label: 'Inventory', title: 'Supply & Assets', desc: 'Real-time multi-warehouse stock levels, SKU tracking, and automated replenishment.', gradient: 'from-[#78350F] to-[#B45309]' },
  { icon: TrendingUp, label: 'Finance', title: 'Financial Operations', desc: 'Invoicing, receivables ledger, multi-currency accounting, and expense control.', gradient: 'from-[#9A3412] to-[#EA580C]' },
  { icon: Zap, label: 'Marketing', title: 'Growth Campaigns', desc: 'Multi-touch attribution, audience segmentation, and outbound engagement tracking.', gradient: 'from-[#D97706] to-[#FBBF24]' },
  { icon: BarChart3, label: 'Analytics', title: 'Executive Analytics', desc: 'Cross-functional KPI dashboards, margin velocity, and operational forecasting.', gradient: 'from-[#5C3A21] to-[#D97706]' },
  { icon: FolderOpen, label: 'Documents', title: 'Document Repository', desc: 'Structured repository, metadata classification, and legal agreement indexing.', gradient: 'from-[#78350F] to-[#EA580C]' },
  { icon: BrainCircuit, label: 'Intelligence', title: 'Decision Intelligence', desc: 'Context-grounded semantic retrieval, cross-department synthesis, and predictive modeling.', gradient: 'from-[#EA580C] to-[#F59E0B]' },
];

const workflowSteps = [
  { num: '01', title: 'Originate', desc: 'Enterprise demand ingested from multi-channel funnels into an authoritative master pipeline.', icon: Target, color: '#D97706' },
  { num: '02', title: 'Evaluate', desc: 'Algorithmic qualification, margin projection, and owner routing across territories.', icon: Users, color: '#EA580C' },
  { num: '03', title: 'Execute', desc: 'Seamless transition into contractual quotations, client commitments, and binding orders.', icon: ShoppingCart, color: '#9A3412' },
  { num: '04', title: 'Fulfill', desc: 'Synchronized coordination across inventory, procurement, invoicing, and collections.', icon: Workflow, color: '#78350F' },
  { num: '05', title: 'Synthesize', desc: 'Audit-ready observability across commercial ledgers, detecting variances and trends.', icon: Cpu, color: '#F59E0B' },
];

const roles = [
  { role: 'Managing Director / Owner', modules: 'Complete Organization Visibility', color: '#78350F', desc: 'Total strategic control across operational metrics, margins, and departmental health.' },
  { role: 'Commercial Director', modules: 'CRM · Pipeline · Commercial Analytics', color: '#B45309', desc: 'Pipeline governance, contract threshold approvals, and revenue velocity oversight.' },
  { role: 'Financial Controller', modules: 'Ledger · Invoicing · Liquidity', color: '#9A3412', desc: 'Cash flow reconciliation, expense governance, and audit-ready fiscal reporting.' },
  { role: 'Operations & Supply Lead', modules: 'Inventory · Procurement · Logistics', color: '#5C3A21', desc: 'Warehouse throughput, buffer thresholds, and vendor fulfillment tracking.' },
];

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '256-bit', label: 'AES Encryption' },
  { value: 'SOC 2', label: 'Compliance Standards' },
  { value: '< 100ms', label: 'Query Latency' },
];

const testimonials = [
  { name: 'Rajesh Mehta', role: 'Managing Director, Nova Distributors', quote: 'BizNexus consolidated four disconnected legacy platforms into one authoritative ledger. Our leadership team finally operates from unified data.', avatar: 'RM' },
  { name: 'Priya Sharma', role: 'Chief Operating Officer, Acme Industries', quote: 'Granular access governance ensures every operating unit has precisely the capabilities required — with zero operational clutter.', avatar: 'PS' },
  { name: 'Arjun Patel', role: 'Commercial Director, TechVista Enterprise', quote: 'Our quote-to-cash cycle contracted by 40%. Complete pipeline traceability has established an unprecedented standard of execution.', avatar: 'AP' },
];

/* ─── Main Landing Component ──────────────────────────────────────────────── */

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  // Auto-rotate platform module cards
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveModule((prev) => (prev + 1) % modules.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll events with smooth hysteresis
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;

    // Smooth hysteresis: switch to side menu above 110px, back to top bar below 60px
    setScrolled((prev) => {
      if (!prev && scrollTop > 110) return true;
      if (prev && scrollTop < 60) return false;
      return prev;
    });

    // Calculate overall scroll progress percentage
    if (scrollHeight > 0) {
      setScrollProgress(Math.round((scrollTop / scrollHeight) * 100));
    }

    // Determine current active section
    const sectionIds = ['hero', 'platform', 'workflow', 'roles', 'intelligence', 'security', 'testimonials', 'cta'];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const offsetTop = el.offsetTop - container.offsetTop;
        if (scrollTop >= offsetTop - container.clientHeight * 0.35) {
          setActiveSection(id);
        }
      }
    }
  };

  // Smooth scroll handler for both navbar & sidebar navigation
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Keyboard navigation for jumping smoothly between snap sections
  useEffect(() => {
    const sectionIds = ['hero', 'platform', 'workflow', 'roles', 'intelligence', 'security', 'testimonials', 'cta'];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown'].includes(e.key)) {
        const curIdx = sectionIds.indexOf(activeSection);
        if (curIdx < sectionIds.length - 1) {
          e.preventDefault();
          scrollToSection(sectionIds[curIdx + 1]);
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        const curIdx = sectionIds.indexOf(activeSection);
        if (curIdx > 0) {
          e.preventDefault();
          scrollToSection(sectionIds[curIdx - 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-[#FAF7F2] text-[#1F130B] antialiased selection:bg-[#EA580C] selection:text-white"
      style={{
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        scrollPaddingTop: '1rem',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          1. TOP HORIZONTAL NAVIGATION (Clean, Professional, Frosted Glass)
          ═══════════════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          scrolled
            ? '-translate-y-full scale-[0.98] opacity-0 blur-[4px] pointer-events-none'
            : 'translate-y-0 scale-100 opacity-100 blur-0 pointer-events-auto'
        }`}
      >
        <div className="absolute inset-0 bg-[#FAF7F2]/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-[#2A1810]/10 shadow-xs" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4.5 lg:px-8">
          {/* Brand Logo - Clean, No v2.0 Tag */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3.5 group text-left cursor-pointer"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#5C3A21] via-[#78350F] to-[#D97706] text-lg font-bold text-white shadow-md shadow-[#78350F]/20 transition-transform group-hover:scale-105">
              B
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="font-display text-[18px] font-extrabold tracking-tight text-[#1F130B]">
                BizNexus
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#92400E]">
                Enterprise Operations Platform
              </div>
            </div>
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems
              .filter((item) => item.id !== 'hero')
              .map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#2A1810]/8 text-[#1F130B] shadow-xs'
                        : 'text-[#5C3A21] hover:text-[#1F130B] hover:bg-[#2A1810]/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-3.5 py-2 text-[13px] font-bold text-[#5C3A21] transition-colors hover:text-[#1F130B] hover:bg-[#2A1810]/5 sm:block"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-orange-600/25 transition-all hover:shadow-xl hover:shadow-orange-600/35 hover:-translate-y-0.5"
            >
              Register Business
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-[#5C3A21] hover:bg-[#2A1810]/5 lg:hidden cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Top Bar) */}
        {mobileMenuOpen && (
          <div className="relative border-t border-[#2A1810]/10 bg-[#FAF7F2]/95 backdrop-blur-2xl px-6 py-4 lg:hidden animate-fade-in shadow-2xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left block rounded-lg px-4 py-3 text-sm font-semibold text-[#5C3A21] hover:bg-[#2A1810]/5 hover:text-[#1F130B] cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-[#2A1810]/10 pt-3">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#5C3A21] hover:text-[#1F130B] text-center"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] px-4 py-2.5 text-sm font-bold text-white text-center shadow-md shadow-orange-500/25"
              >
                Request Access
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. GLASSMORHIC FLOATING SIDE MENU (Professional Icons & Typography)
          ═══════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed left-4 lg:left-6 top-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          scrolled
            ? 'translate-y-[-50%] translate-x-0 scale-100 opacity-100 blur-0 pointer-events-auto'
            : 'translate-y-[-50%] -translate-x-24 scale-[0.88] opacity-0 blur-md pointer-events-none'
        }`}
      >
        {/* Ambient Warm Halo Backlight */}
        <div className="absolute -inset-2.5 rounded-[36px] bg-gradient-to-b from-[#EA580C]/25 via-[#D97706]/20 to-[#78350F]/25 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Frosted Dark Chocolate Glass Capsule */}
        <div
          className={`relative group rounded-[28px] bg-[#1A0F08]/85 backdrop-blur-3xl backdrop-saturate-200 border border-[#D97706]/30 shadow-[0_24px_50px_rgba(26,15,8,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] p-2.5 flex flex-col items-center gap-2 text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            sidebarExpanded ? 'w-56' : 'w-[68px]'
          }`}
        >
          {/* Top Brand Emblem & Expand/Collapse Toggle */}
          <div className="flex items-center justify-between w-full px-1 pt-1 pb-2 border-b border-white/[0.08]">
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-2.5 overflow-hidden text-left cursor-pointer group/logo"
              title="Return to top"
            >
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#78350F] via-[#D97706] to-[#EA580C] text-base font-bold text-white shadow-lg shadow-orange-600/30 transition-transform group-hover/logo:scale-105">
                B
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover/logo:opacity-100 transition-opacity" />
              </div>
              {sidebarExpanded && (
                <div className="min-w-0 transition-opacity duration-300">
                  <div className="font-display text-[14px] font-bold tracking-tight text-white truncate">
                    BizNexus
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-amber-400 truncate">
                    Directory
                  </div>
                </div>
              )}
            </button>

            {/* Desktop Collapse / Expand Toggle */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-amber-200/70 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              title={sidebarExpanded ? 'Collapse Menu' : 'Expand Menu'}
            >
              {sidebarExpanded ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            </button>
          </div>

          {/* Micro Flow Progress Bar */}
          <div className="w-full px-1.5 py-1">
            <div className="flex items-center justify-between text-[9px] font-semibold text-amber-200/70 uppercase tracking-wider mb-1">
              <span>{sidebarExpanded ? 'Flow' : ''}</span>
              <span className="text-amber-400 font-mono text-[9px]">{scrollProgress}%</span>
            </div>
            <div className="h-1 w-full bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#F59E0B] rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          {/* Staggered Glass Menu Navigation Items */}
          <nav className="w-full space-y-1 my-1">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  title={item.label}
                  style={{
                    transform: scrolled ? 'translateX(0)' : 'translateX(-24px)',
                    opacity: scrolled ? 1 : 0,
                    transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${scrolled ? 80 + i * 40 : 0}ms`,
                  }}
                  className={`group/btn relative flex items-center w-full rounded-2xl p-2 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D97706]/35 via-[#EA580C]/30 to-[#9A3412]/25 border border-[#F59E0B]/50 text-white shadow-[0_0_18px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'text-stone-300 hover:text-white hover:bg-white/[0.08] hover:border-white/15 border border-transparent'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white shadow-md shadow-orange-500/40 scale-105'
                        : 'bg-white/[0.05] text-stone-400 group-hover/btn:text-white group-hover/btn:bg-white/[0.1] group-hover/btn:scale-105'
                    }`}
                  >
                    <Icon size={15} />
                  </div>
                  {sidebarExpanded && (
                    <span className="ml-2.5 truncate flex-1 text-left tracking-wide transition-opacity duration-300 font-medium text-[13px]">
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <span className="relative flex h-2 w-2 ml-auto shrink-0 mr-1">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Quick Controls (Scroll to Top & Quick CTA) */}
          <div className="w-full pt-2 border-t border-white/[0.08] flex flex-col items-center gap-1.5">
            {sidebarExpanded ? (
              <>
                <div className="flex items-center gap-1.5 w-full">
                  <Link
                    to="/login"
                    className="flex-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 py-1.5 text-center text-[11px] font-medium text-stone-200 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                  <button
                    onClick={() => scrollToSection('hero')}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] hover:bg-[#EA580C]/40 border border-white/10 text-stone-300 hover:text-white transition-all hover:scale-110 cursor-pointer"
                    title="Scroll to Top"
                  >
                    <ArrowUp size={14} />
                  </button>
                </div>
                <Link
                  to="/login"
                  className="group/cta flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] py-2 text-[11px] font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:shadow-orange-600/45 hover:-translate-y-0.5"
                >
                  <span>Request Access</span>
                  <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-0.5" />
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] hover:bg-[#EA580C]/40 border border-white/10 text-stone-300 hover:text-white transition-all hover:scale-110 cursor-pointer"
                  title="Scroll to Top"
                >
                  <ArrowUp size={14} />
                </button>
                <Link
                  to="/login"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white shadow-lg shadow-orange-600/30 hover:scale-105 transition-transform"
                  title="Request Access"
                >
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: HERO (#hero) - Uncluttered Executive Presence
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen w-full snap-start flex flex-col justify-between overflow-hidden bg-[#FAF7F2] text-[#1F130B] pt-28 lg:pt-32 pb-8"
        style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}
      >
        {/* Warm Ambient Gradients in Amber, Copper, and Chocolate */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(217,119,6,0.12),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_45%,rgba(234,88,12,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_75%,rgba(120,53,15,0.06),transparent)]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(31,19,11,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(31,19,11,0.2) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Hero Main Content */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 my-auto w-full">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left Column: Clean Headings & Direct Executive CTAs */}
            <div>
              {/* Dominant Headings with Vibrant POP Accent */}
              <h1
                className="font-display text-4xl sm:text-6xl lg:text-[4.3rem] font-extrabold leading-[1.04] tracking-tight text-[#1F130B]"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? 'translateY(0)' : 'translateY(25px)',
                  transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s',
                }}
              >
                One intelligent
                <br />
                platform for your
                <br />
                <span
                  className="bg-gradient-to-r from-[#B45309] via-[#EA580C] to-[#D97706] bg-clip-text text-transparent bg-[length:200%_auto] drop-shadow-xs"
                  style={{ animation: 'shimmer-text 4s linear infinite' }}
                >
                  entire business.
                </span>
              </h1>

              <p
                className="mt-6 max-w-lg text-base sm:text-lg leading-7 sm:leading-8 text-[#5C3A21]/90 font-normal"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s',
                }}
              >
                BizNexus coordinates commercial pipelines, warehouse fulfillment, financial operations, and decision intelligence in one tenant-isolated architecture.
              </p>

              {/* CTAs */}
              <div
                className="mt-8 flex flex-wrap items-center gap-4"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s',
                }}
              >
                <Link
                  to="/login"
                  className="group relative flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] px-7.5 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-orange-600/30 transition-all hover:-translate-y-0.5 hover:shadow-orange-600/40"
                >
                  <span className="relative flex items-center gap-2.5">
                    Deploy Enterprise Workspace
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <button
                  onClick={() => scrollToSection('platform')}
                  className="group flex items-center gap-2.5 rounded-2xl border-2 border-[#5C3A21]/20 bg-white/60 px-6 py-3.5 text-[15px] font-bold text-[#2A1810] backdrop-blur-sm transition-all hover:bg-white hover:border-[#5C3A21]/40 cursor-pointer shadow-xs"
                >
                  <Play size={15} className="text-[#EA580C] fill-[#EA580C]" />
                  Explore Capabilities
                </button>
              </div>

              {/* Professional Architecture Highlights */}
              <div
                className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#5C3A21]"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s',
                }}
              >
                {['Unified Commercial Architecture', 'Deterministic Tenant Isolation', 'Context-Aware Decision Core'].map((item) => (
                  <span key={item} className="flex items-center gap-2 font-semibold">
                    <Check size={14} className="text-[#D97706]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Live Interactive Mockup (Clean Corporate Window) */}
            <div
              className="relative lg:pt-2"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s',
              }}
            >
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#D97706]/20 via-[#EA580C]/10 to-transparent blur-3xl" />
              <div className="relative rounded-2xl border border-[#2A1810]/15 bg-white/80 p-2 shadow-2xl shadow-[#2A1810]/15 backdrop-blur-md">
                {/* Browser Bar */}
                <div className="flex items-center gap-2 rounded-t-xl bg-[#26170E] px-4 py-3 border-b border-white/[0.08]">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="ml-3 flex items-center gap-2 rounded-lg bg-white/[0.08] px-3 py-1">
                    <Lock size={10} className="text-amber-400" />
                    <span className="text-[11px] text-stone-300">biznexus.app/workspace</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-[10px] font-medium text-stone-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Operational
                  </div>
                </div>

                {/* Dashboard Snapshot */}
                <div className="rounded-b-xl bg-gradient-to-b from-[#FDFBF7] to-[#F5EFEB] p-4 text-[#1F130B]">
                  {/* Top Bar inside mockup */}
                  <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#2A1810]/10">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#78350F] to-[#D97706] flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                        B
                      </div>
                      <span className="text-[13px] font-bold text-[#1F130B]">Executive Overview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <BrainCircuit size={11} className="text-[#EA580C]" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#5C3A21]">Entity: Nova Corporation</span>
                    </div>
                  </div>

                  {/* KPI Cards Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'Revenue', value: '₹42.8L', change: '+18.4%', color: 'text-[#B45309]', bg: 'bg-[#FEF3C7]/60 border-[#FDE68A]' },
                      { label: 'Pipeline', value: '₹24.5L', change: '+12.1%', color: 'text-[#EA580C]', bg: 'bg-orange-50/70 border-orange-200' },
                      { label: 'Customers', value: '486', change: '+28 new', color: 'text-[#78350F]', bg: 'bg-amber-50/80 border-amber-200' },
                      { label: 'Win Rate', value: '68%', change: '+5.2%', color: 'text-[#C2410C]', bg: 'bg-stone-50 border-stone-200' },
                    ].map((kpi) => (
                      <div key={kpi.label} className={`rounded-xl ${kpi.bg} p-2.5 border backdrop-blur-sm`}>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-[#5C3A21]">{kpi.label}</div>
                        <div className={`mt-1 text-base sm:text-lg font-extrabold ${kpi.color}`}>{kpi.value}</div>
                        <div className="mt-0.5 text-[9px] font-bold text-emerald-700">{kpi.change}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart + Decision Engine Card */}
                  <div className="grid grid-cols-[1.3fr_0.7fr] gap-2.5">
                    <div className="rounded-xl border border-[#2A1810]/10 bg-white p-3 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-[#1F130B]">Revenue Velocity</span>
                        <BarChart3 size={13} className="text-[#EA580C]" />
                      </div>
                      <div className="flex h-16 items-end gap-[5px]">
                        {[35, 48, 42, 58, 55, 72, 78, 68, 85, 80, 95, 100].map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-t-[3px] transition-all duration-700 ${
                              i >= 9
                                ? 'bg-gradient-to-t from-[#B45309] to-[#EA580C] shadow-[0_0_8px_rgba(234,88,12,0.4)]'
                                : 'bg-[#E2D6CA]'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="mt-1.5 flex justify-between text-[8px] text-[#5C3A21]/70 font-semibold">
                        <span>Jan</span>
                        <span>Jun</span>
                        <span>Dec</span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-[#26170E] via-[#3E2413] to-[#5C3A21] border border-white/10 p-3 text-white flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300">
                        <BrainCircuit size={12} className="text-amber-300" />
                        Decision Intelligence Core
                      </div>
                      <p className="mt-1 text-[10px] leading-[1.5] text-amber-100 font-normal">
                        Distributor wholesale channels generated 62% of margin expansion. Reorder cadence accelerated by 18 days.
                      </p>
                      <div className="text-[9px] text-amber-300/80 font-medium">Grounded across 4 operational ledgers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full pt-4 border-t border-[#2A1810]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5C3A21]">
              Trusted by enterprise organizations:
            </span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[#5C3A21] text-[13px] font-semibold">
              {['Nova Distributors', 'Acme Industries', 'TechVista Solutions', 'Zenith Exports'].map((name) => (
                <div key={name} className="flex items-center gap-2 hover:text-[#1F130B] transition-colors">
                  <Building2 size={15} className="text-[#EA580C]" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
            {/* Scroll down trigger */}
            <button
              onClick={() => scrollToSection('platform')}
              className="flex items-center gap-2 rounded-full border border-[#5C3A21]/20 bg-white/60 px-3.5 py-1 text-[11px] font-semibold text-[#5C3A21] hover:bg-white hover:text-[#1F130B] transition-colors cursor-pointer shadow-xs"
            >
              <span>Scroll to explore</span>
              <ChevronDown size={13} className="animate-bounce text-[#EA580C]" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: PLATFORM MODULES (#platform) - Deep Chocolate Espresso
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="platform"
        className="relative min-h-screen w-full snap-start flex flex-col justify-center overflow-hidden bg-[#1A0F08] text-[#FAF7F2] py-20 lg:py-24"
        style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#EA580C]/15 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#D97706]/15 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F59E0B] mb-3 block">
              Enterprise Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Every department.{' '}
              <span className="bg-gradient-to-r from-[#F59E0B] via-[#FB923C] to-[#F59E0B] bg-clip-text text-transparent">
                One unified workspace.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-7 text-stone-300">
              Replace fragmented tools with a single source of truth — from lead generation to invoicing and executive intelligence.
            </p>
          </AnimatedSection>

          {/* 8 Platform Modules Grid */}
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              const isSelected = activeModule === i;
              return (
                <div
                  key={mod.label}
                  onClick={() => setActiveModule(i)}
                  className={`group relative rounded-2xl border p-5 transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'border-[#EA580C]/70 bg-[#2E190E]/90 shadow-xl shadow-orange-950/50 -translate-y-1'
                      : 'border-white/[0.08] bg-white/[0.03] hover:border-[#D97706]/40 hover:bg-white/[0.06] hover:-translate-y-0.5'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} opacity-0 transition-opacity duration-300 ${
                      isSelected ? 'opacity-15' : 'group-hover:opacity-10'
                    }`}
                  />
                  <div className="relative">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${mod.gradient} text-white shadow-lg`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="mt-3 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">
                        {mod.label}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white">{mod.title}</h3>
                    <p className="mt-1.5 text-xs sm:text-sm leading-5 sm:leading-6 text-stone-300 font-normal">
                      {mod.desc}
                    </p>
                    <div
                      className={`mt-3 flex items-center gap-1.5 text-xs font-bold transition-colors ${
                        isSelected ? 'text-amber-300' : 'text-stone-400 group-hover:text-amber-400'
                      }`}
                    >
                      Inspect module capabilities <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section Down Chevron */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => scrollToSection('workflow')}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>Next: Operational Workflow</span>
              <ChevronDown size={14} className="text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: WORKFLOW (#workflow) - Off-White Cream Luxury Flow
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="workflow"
        className="relative min-h-screen w-full snap-start flex flex-col justify-center overflow-hidden bg-[#F5EFEB] text-[#1F130B] py-20 lg:py-24"
        style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,119,6,0.1),transparent_60%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B45309] mb-3 block">
              Operational Lifecycle
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1F130B]">
              From initial enquiry to{' '}
              <span className="bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#B45309] bg-clip-text text-transparent">
                confirmed revenue.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-7 text-[#5C3A21]">
              Eliminate operational silos. Every business handoff is tracked, measured, and ready for immediate action.
            </p>
          </AnimatedSection>

          {/* 5-Step Pipeline */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group relative rounded-2xl border border-[#2A1810]/10 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#EA580C]/40 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[13px] font-extrabold tracking-wider" style={{ color: step.color }}>
                      {step.num}
                    </span>
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shadow-xs"
                      style={{ background: `${step.color}18` }}
                    >
                      <Icon size={16} style={{ color: step.color }} />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1F130B] mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-[13px] leading-5 sm:leading-6 text-[#5C3A21] font-normal">{step.desc}</p>
                  {i < 4 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight size={16} className="text-[#B45309]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Section Down Chevron */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => scrollToSection('roles')}
              className="flex items-center gap-2 rounded-full border border-[#2A1810]/15 bg-white px-4 py-1.5 text-xs font-semibold text-[#5C3A21] hover:text-[#1F130B] hover:border-[#2A1810]/30 transition-colors cursor-pointer shadow-xs"
            >
              <span>Next: Access Governance</span>
              <ChevronDown size={14} className="text-[#EA580C]" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4: ROLES (#roles) - Deep Dark Chocolate Brown
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="roles"
        className="relative min-h-screen w-full snap-start flex flex-col justify-center overflow-hidden bg-[#1E120A] text-[#FAF7F2] py-20 lg:py-24"
        style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}
      >
        <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#EA580C]/15 blur-[130px] -translate-y-1/2 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedSection>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FB923C] mb-3 block">
                Access Governance
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Every role sees{' '}
                <span className="bg-gradient-to-r from-[#F59E0B] via-[#FB923C] to-[#FBBF24] bg-clip-text text-transparent">
                  exactly what it needs.
                </span>
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-7 text-stone-300">
                Owners enjoy bird's-eye enterprise control. Managers supervise team pipelines. Executives focus on their specific tasks with zero distractions.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Module-level access restriction',
                  'Per-action permissions (view, create, edit, delete, export, approve)',
                  'User-level overrides and role inheritance',
                  'Data privacy boundaries between departments',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/30">
                      <Check size={12} className="text-amber-400" />
                    </div>
                    <span className="text-sm text-stone-200">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Role Cards List */}
            <AnimatedSection delay={150}>
              <div className="space-y-3">
                {roles.map((r) => (
                  <div
                    key={r.role}
                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4.5 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-0.5 hover:border-amber-500/40"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-white font-bold text-sm shrink-0 shadow-md"
                        style={{ background: r.color }}
                      >
                        {r.role
                          .split(' ')
                          .map((w) => w[0])
                          .join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display text-[15px] font-bold text-white">{r.role}</h4>
                          <ChevronRight size={14} className="text-stone-500 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <p className="text-[12px] font-semibold text-amber-300 mt-0.5">{r.modules}</p>
                        <p className="text-[13px] text-stone-300 mt-1 font-normal">{r.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Section Down Chevron */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => scrollToSection('intelligence')}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>Next: Decision Intelligence</span>
              <ChevronDown size={14} className="text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5: INTELLIGENCE (#intelligence) - Off-White Cream Canvas
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="intelligence"
        className="relative min-h-screen w-full snap-start flex flex-col justify-center overflow-hidden bg-[#FAF7F2] text-[#1F130B] py-20 lg:py-24"
        style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}
      >
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Semantic Intelligence Interactive Console */}
            <AnimatedSection delay={100}>
              <div className="relative">
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#EA580C]/15 to-[#D97706]/15 blur-2xl" />
                <div className="relative rounded-2xl border border-[#2A1810]/15 bg-white shadow-2xl shadow-[#2A1810]/10 overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-[#2A1810]/10 px-5 py-3.5 bg-[#26170E] text-white">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D97706] to-[#EA580C] flex items-center justify-center shadow-md">
                      <BrainCircuit size={15} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">BizNexus Semantic Core</div>
                      <div className="text-[11px] text-amber-300 font-medium">Deterministic Retrieval Engine • Active</div>
                    </div>
                  </div>
                  <div className="p-5 space-y-4 bg-[#FDFBF7]">
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-br-md bg-gradient-to-r from-[#D97706] to-[#EA580C] px-4 py-2.5 text-[13px] font-semibold text-white max-w-[85%] shadow-md">
                        Reconcile Q3 distributor fulfillment margins against procurement variances.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-7 w-7 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0 mt-1">
                        <BrainCircuit size={13} className="text-[#EA580C]" />
                      </div>
                      <div className="rounded-2xl rounded-bl-md bg-white border border-[#2A1810]/10 px-4 py-3 text-[13px] text-[#1F130B] leading-6 max-w-[88%] shadow-xs">
                        Analysis across 1,842 ledger transactions and 14 supplier contracts:
                        <div className="mt-2 space-y-1 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#EA580C]">1.</span> Distributor wholesale volume: ₹18.4L (Gross margin: 38.2%)
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#EA580C]">2.</span> Procurement cost variance: -4.1% following renegotiations
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#EA580C]">3.</span> Unallocated receivables: ₹1.4L pending 30-day milestone
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-[#5C3A21] font-semibold">
                          <Database size={11} className="text-[#EA580C]" /> Grounded across 3 audited ledgers
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#2A1810]/10 px-5 py-3 flex items-center gap-3 bg-[#F5EFEB]">
                    <div className="flex-1 rounded-xl bg-white border border-[#2A1810]/15 px-4 py-2 text-[12px] text-[#5C3A21]">
                      Query cross-functional ledgers, stock forecasts, or legal terms...
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-[#D97706] to-[#EA580C] flex items-center justify-center text-white shadow-xs">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* AI Capabilities Description */}
            <AnimatedSection>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B45309] mb-3 block">
                Deterministic Intelligence
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1F130B]">
                Operational intelligence{' '}
                <span className="bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#B45309] bg-clip-text text-transparent">
                  grounded in reality.
                </span>
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-7 text-[#5C3A21]">
                Context-governed neural retrieval. BizNexus parses contracts, order pipelines, warehouse logs, and financial records into private, tenant-isolated vector namespaces with verifiable attribution.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3.5">
                {[
                  { icon: FileSearch, label: 'Semantic Vector Parsing', desc: 'Multi-format document indexing into tenant-scoped embeddings' },
                  { icon: Network, label: 'Deterministic Retrieval', desc: 'Hybrid search across relational ledgers and unstructured records' },
                  { icon: ShieldCheck, label: 'Zero Contamination', desc: 'Cryptographic namespace isolation prevents cross-tenant leakage' },
                  { icon: Compass, label: 'Verifiable Attribution', desc: 'Direct citation trace linked to the exact source record and timestamp' },
                ].map((feat) => (
                  <div
                    key={feat.label}
                    className="rounded-xl border border-[#2A1810]/10 bg-white p-3.5 transition-all hover:border-[#EA580C]/40 hover:shadow-md"
                  >
                    <feat.icon size={18} className="text-[#EA580C] mb-2" />
                    <div className="text-[13px] font-bold text-[#1F130B]">{feat.label}</div>
                    <div className="text-[11px] text-[#5C3A21] mt-1 leading-4.5 font-normal">{feat.desc}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Section Down Chevron */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => scrollToSection('security')}
              className="flex items-center gap-2 rounded-full border border-[#2A1810]/15 bg-white px-4 py-1.5 text-xs font-semibold text-[#5C3A21] hover:text-[#1F130B] hover:border-[#2A1810]/30 transition-colors cursor-pointer shadow-xs"
            >
              <span>Next: Data Isolation & Security</span>
              <ChevronDown size={14} className="text-[#EA580C]" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6: SECURITY & ISOLATION (#security) - Deep Dark Espresso
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="security"
        className="relative min-h-screen w-full snap-start flex flex-col justify-center overflow-hidden bg-[#150D06] text-[#FAF7F2] py-20 lg:py-24"
        style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}
      >
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400 mb-3 block">
              Data Isolation Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Every company gets its{' '}
              <span className="bg-gradient-to-r from-[#F59E0B] via-[#FB923C] to-[#FBBF24] bg-clip-text text-transparent">
                own isolated realm.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-7 text-stone-300">
              Zero data leakage. Row-Level Security (RLS) ensures absolute partitioning across organizations.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 lg:grid-cols-2 mb-10">
            {/* Visual Tenant Isolation Demonstration */}
            <AnimatedSection>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6">
                <div className="space-y-3.5">
                  {[
                    { company: 'Tenant Alpha (Distributor)', items: ['Users', 'Leads', 'Orders', 'Documents', 'Vector Store'], color: '#D97706' },
                    { company: 'Tenant Beta (Retailer)', items: ['Users', 'Leads', 'Orders', 'Documents', 'Vector Store'], color: '#EA580C' },
                  ].map((tenant) => (
                    <div
                      key={tenant.company}
                      className="rounded-xl border border-white/[0.08] p-4"
                      style={{ background: `${tenant.color}15` }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md"
                          style={{ background: tenant.color }}
                        >
                          {tenant.company[7]}
                        </div>
                        <span className="text-sm font-bold text-white">{tenant.company}</span>
                        <Lock size={12} className="text-amber-300 ml-auto" />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tenant.items.map((item) => (
                          <span
                            key={item}
                            className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-stone-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-3 py-1">
                    <div className="h-px flex-1 bg-red-500/20" />
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      <X size={12} /> Strict Isolation Boundary
                    </span>
                    <div className="h-px flex-1 bg-red-500/20" />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Security Highlights */}
            <AnimatedSection delay={150}>
              <div className="space-y-3">
                {[
                  { icon: Lock, title: 'Tenant-Scoped Queries', desc: 'Every SQL execution automatically prepends tenant context at the ORM layer.', color: '#D97706' },
                  { icon: Shield, title: 'Row-Level Security (RLS)', desc: 'PostgreSQL kernel guarantees zero access outside the verified JWT session.', color: '#EA580C' },
                  { icon: Fingerprint, title: 'Cryptographic Audit Trail', desc: 'Immutable records for changes to customer data, invoices, and permissions.', color: '#F59E0B' },
                  { icon: Database, title: 'Namespaced Vector Stores', desc: 'Embedding namespaces prevent LLM crossover across different tenants.', color: '#B45309' },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 transition-all hover:bg-white/[0.05] hover:border-amber-500/30"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
                        style={{ background: `${feat.color}25` }}
                      >
                        <feat.icon size={16} style={{ color: feat.color }} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-white">{feat.title}</h4>
                        <p className="text-[12px] text-stone-300 mt-0.5 leading-5 font-normal">{feat.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center"
              >
                <div className="text-xl sm:text-2xl font-extrabold font-display text-white">{stat.value}</div>
                <div className="text-[11px] text-amber-200/80 mt-0.5 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Section Down Chevron */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => scrollToSection('testimonials')}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>Next: Enterprise Validation</span>
              <ChevronDown size={14} className="text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 7: TESTIMONIALS (#testimonials) - Warm Off-White Cream
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="testimonials"
        className="relative min-h-screen w-full snap-start flex flex-col justify-center overflow-hidden bg-[#F7F2EC] text-[#1F130B] py-20 lg:py-24"
        style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}
      >
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B45309] mb-3 block">
              Enterprise Validation
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1F130B]">
              Built for operators who{' '}
              <span className="bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#B45309] bg-clip-text text-transparent">
                demand precision.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-7 text-[#5C3A21]">
              Hear from leadership teams who consolidated their operations onto BizNexus.
            </p>
          </AnimatedSection>

          {/* Testimonial Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 100}>
                <div className="group relative rounded-2xl border border-[#2A1810]/10 bg-white p-6.5 transition-all hover:shadow-xl hover:border-[#EA580C]/40 hover:-translate-y-1 h-full flex flex-col justify-between shadow-xs">
                  <div>
                    <Quote size={24} className="text-[#EA580C]/40 mb-3" />
                    <p className="text-[14px] sm:text-[15px] leading-6 sm:leading-7 text-[#1F130B] font-normal">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#2A1810]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#78350F] to-[#D97706] text-white text-xs font-bold shadow-md">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1F130B]">{t.name}</div>
                        <div className="text-[11px] text-[#5C3A21] font-medium">{t.role}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={12} className="text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Section Down Chevron */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => scrollToSection('cta')}
              className="flex items-center gap-2 rounded-full border border-[#2A1810]/15 bg-white px-4 py-1.5 text-xs font-semibold text-[#5C3A21] hover:text-[#1F130B] hover:border-[#2A1810]/30 transition-colors cursor-pointer shadow-xs"
            >
              <span>Next: Deployment</span>
              <ChevronDown size={14} className="text-[#EA580C]" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 8: FINAL CTA & COMPREHENSIVE FOOTER (#cta) - Deep Dark Espresso
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="cta"
        className="relative min-h-screen w-full snap-start flex flex-col justify-between overflow-hidden bg-[#120904] text-[#FAF7F2] pt-16 pb-8"
        style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E190E]/40 via-[#120904] to-[#1A0F08] pointer-events-none" />

        {/* CTA Banner */}
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center my-auto w-full">
          <AnimatedSection>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F59E0B] mb-4 block">
              Workspace Deployment
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              Bring clarity to your{' '}
              <span className="bg-gradient-to-r from-[#F59E0B] via-[#FB923C] to-[#FBBF24] bg-clip-text text-transparent">
                entire business.
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-7 text-stone-300 max-w-2xl mx-auto font-normal">
              Deploy your company workspace today. Integrate CRM, sales tracking, inventory, and finance with zero infrastructure overhead.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/login"
                className="group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] px-8 py-4 text-[15px] font-bold text-white shadow-xl shadow-orange-600/35 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-orange-600/50"
              >
                Deploy Enterprise Workspace
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => scrollToSection('hero')}
                className="flex items-center gap-2 rounded-2xl border border-white/20 px-7 py-4 text-[15px] font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 cursor-pointer"
              >
                <ArrowUp size={15} />
                Back to top
              </button>
            </div>
            <p className="mt-5 text-xs text-amber-200/70">
              Immediate deployment · Complete enterprise privacy · Tenant isolation
            </p>
          </AnimatedSection>
        </div>

        {/* Multi-Column Footer */}
        <footer className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full border-t border-white/[0.08] pt-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <button
                onClick={() => scrollToSection('hero')}
                className="flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#78350F] via-[#D97706] to-[#EA580C] text-base font-bold text-white shadow-md">
                  B
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white">BizNexus</div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                    Enterprise Platform
                  </div>
                </div>
              </button>
              <p className="mt-3 text-xs leading-6 text-stone-300 max-w-sm font-normal">
                Unified commercial operations, financial ledgers, and deterministic decision intelligence.
              </p>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-3">Platform</h4>
              <ul className="space-y-2 text-xs text-stone-300">
                {['Commercial & Sales', 'Supply & Inventory', 'Financial Operations', 'Decision Intelligence'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection('platform')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture links */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-3">Architecture</h4>
              <ul className="space-y-2 text-xs text-stone-300">
                {['Multi-Tenancy', 'Access Governance', 'Cryptographic Isolation', 'Audit Ledgers'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection('security')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-3">Deploy</h4>
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Access Workspace →
                </Link>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="block text-xs text-stone-300 hover:text-white transition-colors cursor-pointer"
                >
                  Return to Overview ↑
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
            <span>© 2026 BizNexus Enterprise Platform. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Security Guaranteed</span>
              <span>•</span>
              <span>FastAPI + Supabase Architecture</span>
            </div>
          </div>
        </footer>
      </section>

      {/* ═══════ Shimmer Keyframe Styles ═══════ */}
      <style>{`
        @keyframes shimmer-text {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
