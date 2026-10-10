import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-12 text-center">
      <div className="text-6xl font-display font-bold text-slate-200 mb-4">404</div>
      <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Page not found</h2>
      <p className="text-slate-500 text-sm">The page you are looking for doesn't exist.</p>
      <button onClick={() => navigate('/dashboard')} className="mt-6 px-5 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: '#2563eb' }}>
        Return to Dashboard
      </button>
    </div>
  );
}
