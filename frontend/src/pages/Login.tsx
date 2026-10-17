import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, ChevronDown, Building2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithCredentials, availableUsers, company } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedDemoUser, setSelectedDemoUser] = useState(availableUsers[0] || null);

  useEffect(() => {
    if (availableUsers && availableUsers.length > 0) {
      setSelectedDemoUser(availableUsers[0]);
    }
  }, [availableUsers]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Try real credential-based login first
      await loginWithCredentials(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      // If backend returns error, show it
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (user: typeof availableUsers[0]) => {
    setSelectedDemoUser(user);
    setEmail(user.email);
    setDemoOpen(false);
  };

  const handleDemoLogin = () => {
    if (selectedDemoUser) {
      login(selectedDemoUser.id);
      navigate('/dashboard');
    }
  };

  const roleColors: Record<string, string> = {
    'Business Owner': 'bg-amber-600',
    'Sales Manager': 'bg-orange-600',
    'Sales Executive': 'bg-amber-700',
    'Marketing Manager': 'bg-orange-500',
    'Inventory Manager': 'bg-stone-700',
    'Purchase Manager': 'bg-stone-800',
    'Finance Manager': 'bg-amber-800',
    'Business Analyst': 'bg-yellow-700',
  };

  return (
    <div className="min-h-screen flex bg-[#FAF7F2] text-[#1F130B]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[480px] xl:w-[520px] relative overflow-hidden bg-[#120904] text-[#FAF7F2] p-12 justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E190E]/70 via-[#120904] to-[#1A0F08] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-lg bg-gradient-to-br from-[#78350F] via-[#D97706] to-[#EA580C] shadow-lg shadow-orange-950/40">
              B
            </div>
            <div>
              <div className="font-display font-bold text-white text-xl">BizNexus</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                Enterprise OS
              </div>
            </div>
          </Link>
        </div>

        <div className="relative z-10 my-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/25 mb-4">
            <Building2 size={13} /> {company.companyName}
          </div>
          <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-4">
            Authoritative enterprise access.
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed mb-8">
            Sign in with your registered credentials. Each company's data is cryptographically isolated — users from other companies cannot access your dashboard.
          </p>

          <div className="space-y-3">
            {[
              { icon: '🏛️', label: company.companyName, desc: `Tenant ID: ${company.tenantId} · ${company.industry}` },
              { icon: '👥', label: `${availableUsers.length} Active Role Portals`, desc: 'Multi-role company workspace' },
              { icon: '🔒', label: 'Multi-Tenant Isolation', desc: 'SQLite per-company data separation enforced' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/5">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <div className="text-white text-xs font-bold">{f.label}</div>
                  <div className="text-stone-400 text-[11px] mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <span>© 2026 BizNexus Platform</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Mobile brand */}
          <div className="flex items-center justify-between gap-3 mb-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-white bg-gradient-to-br from-[#78350F] to-[#EA580C]">
                B
              </div>
              <div className="font-display font-bold text-[#1F130B] text-lg">BizNexus</div>
            </Link>
            <Link to="/register" className="text-xs font-bold text-[#EA580C]">
              Deploy Business +
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-8 sm:p-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-2xl font-extrabold text-[#1F130B]">Sign in to portal</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                {company.tenantId ? company.tenantId.slice(0, 14) : 'Demo'}
              </span>
            </div>
            <p className="text-[#5C3A21]/80 text-xs mb-6">
              Enter your registered email and password, or use the demo switcher below.
            </p>

            {/* Real credential form */}
            <form onSubmit={handleLogin} className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C3A21] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#5C3A21]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded text-[#EA580C] accent-[#EA580C]"
                  />
                  <span>Remember session</span>
                </label>
              </div>

              {error && <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] text-white font-bold text-sm shadow-md shadow-orange-600/25 hover:shadow-lg hover:shadow-orange-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Workspace
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-stone-400 font-medium">or use demo switcher</span>
              </div>
            </div>

            {/* DEMO USER SELECTOR */}
            <div className="mb-4 relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-[#5C3A21] uppercase tracking-wider">
                  Demo — Role Switcher
                </label>
                <span className="text-[10px] text-amber-700 font-semibold">In-Memory Only</span>
              </div>

              {selectedDemoUser && (
                <button
                  type="button"
                  onClick={() => setDemoOpen(v => !v)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-amber-200/70 hover:border-[#EA580C] bg-amber-50/40 transition-all text-left cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${roleColors[selectedDemoUser.role] ?? 'bg-amber-700'} shadow-sm`}>
                    {selectedDemoUser.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#1F130B] truncate">{selectedDemoUser.name}</div>
                    <div className="text-[11px] text-[#5C3A21] truncate font-medium">
                      {selectedDemoUser.role} · <span className="text-stone-500">{selectedDemoUser.department}</span>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-stone-400 transition-transform ${demoOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {demoOpen && (
                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden animate-fade-in max-h-64 overflow-y-auto">
                  <div className="px-3.5 py-2 bg-stone-50 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    Demo Staff Portals
                  </div>
                  {availableUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handleDemoSelect(u)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50/50 transition-colors text-left border-b border-stone-50 last:border-0 ${selectedDemoUser?.id === u.id ? 'bg-amber-50/80 font-bold' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${roleColors[u.role] ?? 'bg-amber-700'}`}>
                        {u.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-[#1F130B] truncate">{u.name}</div>
                        <div className="text-[10px] text-stone-500 truncate">{u.role} · {u.email}</div>
                      </div>
                      {selectedDemoUser?.id === u.id && (
                        <div className="w-2 h-2 rounded-full bg-[#EA580C]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl border-2 border-amber-200 text-[#5C3A21] font-bold text-sm hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
            >
              Enter Demo as {selectedDemoUser?.role || 'Demo User'}
              <ArrowRight size={14} />
            </button>

            {/* Quick Register Gateway */}
            <div className="mt-6 pt-5 border-t border-stone-100 text-center">
              <p className="text-xs text-[#5C3A21]">
                Need to register a different company?
              </p>
              <Link
                to="/register"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#9A3412] transition-colors"
              >
                Register New Business Entity <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-[#5C3A21] hover:text-[#1F130B]">
              ← Return to BizNexus Landing Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
