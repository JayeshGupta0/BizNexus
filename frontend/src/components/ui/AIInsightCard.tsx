import { Sparkles, ArrowRight } from 'lucide-react';

interface AIInsightCardProps {
  insight: string;
  title?: string;
  onViewAnalysis?: () => void;
  onAskAI?: () => void;
  compact?: boolean;
}

export default function AIInsightCard({
  insight, title = 'AI Business Insight',
  onViewAnalysis, onAskAI, compact = false,
}: AIInsightCardProps) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#c4b5fd', background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' }}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#7c3aed' }}>
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7c3aed' }}>{title}</span>
        </div>
        <p className={`text-slate-700 leading-relaxed ${compact ? 'text-sm' : 'text-sm'}`}>{insight}</p>
        {!compact && (onViewAnalysis || onAskAI) && (
          <div className="flex gap-2 mt-3">
            {onViewAnalysis && (
              <button
                onClick={onViewAnalysis}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/60"
                style={{ color: '#7c3aed', background: 'rgba(124,58,237,0.1)' }}
              >
                View Analysis <ArrowRight size={12} />
              </button>
            )}
            {onAskAI && (
              <button
                onClick={onAskAI}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: '#7c3aed' }}
              >
                <Sparkles size={12} /> Ask AI
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
