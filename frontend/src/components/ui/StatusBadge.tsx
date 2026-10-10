type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple' | 'blue';

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-slate-100 text-slate-600',
  purple: 'bg-purple-100 text-purple-700',
  blue: 'bg-blue-50 text-blue-700',
};

function getVariant(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (['active', 'delivered', 'paid', 'won', 'completed', 'indexed', 'published', 'received', 'approved', 'confirmed'].some(k => s.includes(k))) return 'success';
  if (['processing', 'partial', 'qualified', 'scheduled', 'sent', 'viewed', 'pending'].some(k => s.includes(k))) return 'warning';
  if (['overdue', 'lost', 'cancelled', 'rejected', 'expired', 'failed', 'out of stock', 'at risk'].some(k => s.includes(k))) return 'danger';
  if (['new', 'draft', 'contacted', 'negotiation'].some(k => s.includes(k))) return 'info';
  if (['proposal'].some(k => s.includes(k))) return 'purple';
  if (['low stock', 'inactive'].some(k => s.includes(k))) return 'neutral';
  return 'neutral';
}

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const DOT_COLORS: Record<BadgeVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
  purple: 'bg-purple-500',
  blue: 'bg-blue-500',
};

export default function StatusBadge({ status, variant, size = 'sm', dot = false }: StatusBadgeProps) {
  const v = variant ?? getVariant(status);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClass} ${VARIANT_STYLES[v]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_COLORS[v]}`} />}
      {status}
    </span>
  );
}
