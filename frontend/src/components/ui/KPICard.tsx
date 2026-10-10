import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeDir?: 'up' | 'down' | 'neutral';
  changeLabel?: string;
  icon?: React.ReactNode;
  accent?: string;
  className?: string;
  onClick?: () => void;
}

export default function KPICard({
  title, value, change, changeDir = 'neutral',
  changeLabel, icon, accent = '#2563eb', className = '', onClick,
}: KPICardProps) {
  const changeColor =
    changeDir === 'up' ? '#16a34a' :
    changeDir === 'down' ? '#dc2626' : '#64748b';

  const ChangeIcon =
    changeDir === 'up' ? TrendingUp :
    changeDir === 'down' ? TrendingDown : Minus;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 ${onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {icon && (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}15` }}>
            <span style={{ color: accent }}>{icon}</span>
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold font-display text-slate-900 leading-tight">{value}</div>
        {change && (
          <div className="flex items-center gap-1 mt-1.5">
            <ChangeIcon size={12} style={{ color: changeColor }} />
            <span className="text-xs font-medium" style={{ color: changeColor }}>{change}</span>
            {changeLabel && <span className="text-xs text-slate-400">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
