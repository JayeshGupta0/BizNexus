import { useNavigate } from 'react-router';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
        <ShieldX size={28} className="text-red-500" />
      </div>
      <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
      <p className="text-slate-500 text-sm max-w-xs">
        You don't have permission to access this module. Contact your administrator to request access.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
        style={{ background: '#2563eb' }}
      >
        <ArrowLeft size={14} /> Return to Dashboard
      </button>
    </div>
  );
}
