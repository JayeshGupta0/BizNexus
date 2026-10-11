import { useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import { Sparkles, ChevronLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BNAISidebar from './BNAISidebar';
import { useApp } from '../../context/AppContext';

export default function AppLayout() {
  const { isLoggedIn, aiSidebarOpen, setAiSidebarOpen } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-full w-full overflow-hidden relative" style={{ background: '#F5F0E8' }}>
      {/* Left Navigation Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Center Main Content Area: Squeezes smoothly when BN AI opens */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ease-in-out">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Floating Arrow Toggle Button on Right Edge (Visible when BN AI is closed) */}
      {!aiSidebarOpen && (
        <button
          onClick={() => setAiSidebarOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1.5 py-3.5 pl-2.5 pr-2 bg-gradient-to-l from-purple-700 via-indigo-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white rounded-l-2xl shadow-xl shadow-purple-950/30 hover:pl-3.5 transition-all duration-200 group border-y border-l border-purple-400/40 cursor-pointer"
          title="Open BN AI (Click arrow to expand side panel)"
          aria-label="Open BN AI side panel"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform text-purple-200" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 rounded-md bg-purple-500/40 flex items-center justify-center text-purple-200">
              <Sparkles size={12} />
            </div>
            <span className="[writing-mode:vertical-lr] text-[11px] font-bold tracking-wider text-purple-100 uppercase py-0.5 select-none">
              BN AI
            </span>
          </div>
        </button>
      )}

      {/* Right Sidebar: BN AI Chat Bot */}
      <BNAISidebar open={aiSidebarOpen} onClose={() => setAiSidebarOpen(false)} />
    </div>
  );
}

