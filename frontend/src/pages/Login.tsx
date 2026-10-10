import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Zap, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { demoUsers } from '../data/mockData';

export default function Login() {
  const navigate = useNavigate();
  const { login, setCurrentUser } = useApp();
  const [email, setEmail] = useState('arjun@biznexuz.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(demoUsers[0]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    login(selectedUser.id);
    navigate('/dashboard');
  };

  const handleDemoSelect = (user: typeof demoUsers[0]) => {
    setSelectedUser(user);
    setEmail(user.email);
    setDemoOpen(false);
  };

  const roleColors: Record<string, string> = {
    'Business Owner': 'bg-blue-600',
    'Sales Manager': 'bg-green-600',
    'Sales Executive': 'bg-teal-600',
    'Marketing Manager': 'bg-pink-600',
    'Inventory Manager': 'bg-orange-600',
    'Purchase Manager': 'bg-yellow-600',
    'Finance Manager': 'bg-purple-600',
    'Business Analyst': 'bg-indigo-600',
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f1f5f9' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[520px] relative overflow-hidden" style={{ background: '#0f172a' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(37,99,235,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.2) 0%, transparent 60%)',
        }} />
        <div className="relative flex-1 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-lg" style={{ background: '#2563eb' }}>B</div>
            <div>
              <div className="font-display font-bold text-white text-xl">BizNexuz</div>
              <div className="text-xs text-slate-400">Intelligent Business Platform</div>
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
              One platform.<br />Every business<br />operation.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              CRM, ERP, marketing, analytics, documents, and AI — unified into one intelligent business platform.
            </p>

            <div className="space-y-3">
              {[
                { icon: '🎯', label: 'Lead-to-revenue pipeline', desc: 'From social media to signed deals' },
                { icon: '🤖', label: 'AI-powered insights', desc: 'RAG-based assistant for your data' },
                { icon: '🔐', label: 'Granular RBAC', desc: 'Role and user-level permissions' },
              ].map(f => (
                <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-xl">{f.icon}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{f.label}</div>
                    <div className="text-slate-400 text-xs">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-slate-500 text-xs">© 2025 BizNexuz. Intelligent Business Platform.</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-white" style={{ background: '#2563eb' }}>B</div>
            <div className="font-display font-bold text-slate-900 text-xl">BizNexuz</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-6">Sign in to your BizNexuz account</p>

            {/* Demo selector */}
            <div className="mb-6 relative">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Demo User
              </label>
              <button
                type="button"
                onClick={() => setDemoOpen(v => !v)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${roleColors[selectedUser.role] ?? 'bg-blue-600'}`}>
                  {selectedUser.avatar}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-slate-800">{selectedUser.name}</div>
                  <div className="text-xs text-slate-500">{selectedUser.role}</div>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${demoOpen ? 'rotate-180' : ''}`} />
              </button>

              {demoOpen && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-fade-in">
                  {demoUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handleDemoSelect(u)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${selectedUser.id === u.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${roleColors[u.role] ?? 'bg-blue-600'}`}>
                        {u.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.role} · {u.department}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</button>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: '#2563eb' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <button
                type="button"
                className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Demo prototype · All data is simulated
          </p>
        </div>
      </div>
    </div>
  );
}
