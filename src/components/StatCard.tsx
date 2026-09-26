import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  subLabel?: string;
  icon?: LucideIcon;
  isPrimary?: boolean;
  tag?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export default function StatCard({
  label,
  value,
  subValue,
  subLabel,
  icon: Icon,
  isPrimary = false,
  tag,
  trend,
}: StatCardProps) {
  return (
    <div
      className={`group relative p-6 rounded-[16px] transition-all duration-200 border ${
        isPrimary
          ? 'bg-[#191C21] border-[#c82a2a]/60 shadow-lg shadow-[#c82a2a]/10 hover:border-[#c82a2a]'
          : 'bg-[#191C21] border-[#27272A] hover:border-[#3F3F46] hover:-translate-y-0.5'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              className={`w-4 h-4 ${isPrimary ? 'text-[#cea03d]' : 'text-[#A1A1AA]'}`}
            />
          )}
          <span className="font-mono font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">
            {label}
          </span>
        </div>
        {tag && (
          <span
            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold tracking-wider uppercase border ${
              isPrimary
                ? 'bg-[#cea03d]/10 text-[#cea03d] border-[#cea03d]/30'
                : 'bg-[#27272A] text-[#A1A1AA] border-[#3F3F46]'
            }`}
          >
            {tag}
          </span>
        )}
      </div>

      {/* Main Big Number */}
      <div className="flex items-baseline gap-3">
        <div
          className={`text-4xl sm:text-5xl font-medium tracking-tight leading-none ${
            isPrimary ? 'text-[#cea03d]' : 'text-white'
          }`}
          style={{ lineHeight: 1.04 }}
        >
          {value}
        </div>
        {subValue && (
          <span className="font-mono text-xs font-semibold text-[#A1A1AA]">
            {subValue}
          </span>
        )}
      </div>

      {/* Footer / Trend / Subtitle */}
      {(subLabel || trend) && (
        <div className="mt-3.5 pt-3 border-t border-[#27272A]/60 flex items-center justify-between text-xs">
          {subLabel && (
            <span className="text-[#A1A1AA] font-sans text-xs line-clamp-1">{subLabel}</span>
          )}
          {trend && (
            <span
              className={`font-mono text-[11px] font-semibold shrink-0 ${
                trend.isPositive ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
