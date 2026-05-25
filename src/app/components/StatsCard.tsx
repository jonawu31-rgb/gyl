import { cloneElement, isValidElement } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'purple' | 'orange';
  icon: React.ReactNode;
}

const colorStyles = {
  blue: {
    cardGlow: 'from-blue-500/10 to-cyan-400/5',
    iconColor: '#3b82f6',
    shadow: '0 6px 20px #3b82f670',
    text: 'text-blue-600',
  },
  green: {
    cardGlow: 'from-emerald-500/10 to-teal-400/5',
    iconColor: '#10b981',
    shadow: '0 6px 20px #10b98170',
    text: 'text-emerald-600',
  },
  purple: {
    cardGlow: 'from-purple-500/10 to-indigo-400/5',
    iconColor: '#8b5cf6',
    shadow: '0 6px 20px #8b5cf670',
    text: 'text-purple-600',
  },
  orange: {
    cardGlow: 'from-orange-500/10 to-amber-400/5',
    iconColor: '#f97316',
    shadow: '0 6px 20px #f9731670',
    text: 'text-orange-600',
  },
};

export function StatsCard({ title, value, subtitle, color, icon }: StatsCardProps) {
  const styles = colorStyles[color];

  const bigIcon = isValidElement(icon)
    ? cloneElement(icon as React.ReactElement<any>, { sx: { fontSize: 72 } })
    : icon;

  return (
    <div className="group relative bg-white rounded-xl px-3 xl:px-4 pt-3 xl:pt-4 pb-2 xl:pb-3 border border-gray-100 hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">

      {/* Large semi-transparent decorative icon — bottom-right */}
      <div
        className="absolute bottom-[-6px] right-[-6px] pointer-events-none opacity-[0.18] group-hover:opacity-[0.26] transition-opacity duration-300"
        style={{ color: styles.iconColor, filter: `drop-shadow(${styles.shadow})`, lineHeight: 1 }}
      >
        {bigIcon}
      </div>

      {/* Text content */}
      <div className="relative">
        <p className="text-[11px] xl:text-xs font-medium text-gray-500 mb-1.5">{title}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl xl:text-2xl font-bold text-gray-900">{value}</span>
          <span className="text-xs text-gray-400 font-medium">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}
